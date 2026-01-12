import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import prisma from "../../../shared/prisma";
import { verifyWebSocketToken } from "./socket.service";
import redisClient from "../../../shared/redis";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const roomUsers = new Map<string, Set<WebSocket>>();
const groupUsers = new Map<string, Set<WebSocket>>();
const connectedUsers = new Set<CustomWebSocket>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.headers["token"] as string;
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) {
      ws.close();
      return;
    }
    const userId = decoded.id;
    ws.userId = userId;
    connectedUsers.add(ws);
    console.log(connectedUsers, "socket.controller.ts", 28);
    // Save the socket for later
    if (!roomUsers.has(userId)) roomUsers.set(userId, new Set());
    roomUsers.get(userId)?.add(ws);

    if (!groupUsers.has(userId)) groupUsers.set(userId, new Set());
    groupUsers.get(userId)?.add(ws);

    let roomId: string | null = null;
    let groupId: string | null = null;

    // ping checking connection exist or not by getting pong from client, if pong not get then it will triggure close event
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    const conversations = await prisma.room.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: { updatedAt: "desc" },

      include: {
        user1: {
          select: { id: true, fullname: true },
        },
        user2: {
          select: { id: true, fullname: true },
        },
      },
    });

    const connectedUserIds = Array.from(connectedUsers)
      .map((ws) => ws.userId)
      .filter((id) => id !== undefined);

    console.log(connectedUserIds, "connectedUserIds");

    const formattedConversations = await Promise.all(
      conversations.map(async (room) => {
        const partner = room.user1Id === userId ? room.user2 : room.user1;
        const isActive = connectedUserIds.includes(partner?.id as string);

        const redisKey = `room:${room.id}:messages`;
        const unreadKey = `room:${room.id}:unread:${userId}`;

        const [redisRaw, unreadCountStr] = await Promise.all([
          redisClient.lrange(redisKey, 0, -1),
          redisClient.get(unreadKey),
        ]);

        const unreadCount = parseInt(unreadCountStr || "0", 10);
        let latestMessage = null;

        if (redisRaw.length > 0) {
          const redisMessages = redisRaw.map((msg) => JSON.parse(msg));

          // Sort by createdAt descending
          redisMessages.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          const latestRedisMsg = redisMessages[0];

          latestMessage = {
            content:
              latestRedisMsg.content ??
              (latestRedisMsg.fileUrl ? "sent file" : null),
            createdAt: latestRedisMsg.createdAt,
          };
        }

        return {
          roomId: room.id,
          partner: {
            id: partner?.id,
            fullname: partner?.fullname,
            isActive,
          },
          lastMessage: latestMessage,
          unreadCount, // From Redis
        };
      }),
    );
    ws.send(
      JSON.stringify({
        type: "member-conversation",
        conversations: formattedConversations,
      }),
    );

    const groupConversations = async () => {
      const groups = await prisma.group.findMany({
        where: {
          memberIds: {
            has: userId,
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return Promise.all(
        groups.map(async (room) => {
          const redisKey = `group:${room.id}:messages`;
          const unreadKey = `group:${room.id}:unread:${userId}`;
          const unreadCount = parseInt(
            (await redisClient.get(unreadKey)) || "0",
            10,
          );

          // Get the latest message from Redis
          const buffered = await redisClient.lrange(redisKey, -1, -1);
          const lastMessage =
            buffered.length > 0 ? JSON.parse(buffered[0]) : null;

          // Determine content
          const lastMessageContent =
            lastMessage?.content ||
            (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

          return {
            roomId: room.id,
            groupName: room.groupName,
            groupPhoto: room.groupPhoto,
            lastMessage: lastMessage
              ? {
                  content: lastMessageContent,
                  createdAt: lastMessage?.createdAt || null,
                }
              : null,
            unreadCount,
          };
        }),
      );
    };

    const groupConvs = await groupConversations();
    ws.send(
      JSON.stringify({
        type: "group-conversation",
        conversations: groupConvs,
      }),
    );

    ws.on("message", async (message: any) => {
      try {
        const { type, receiverId, content, fileUrl, incomingGroupId } =
          JSON.parse(message.toString());

        const getConversationsForUser = async (targetUserId: string) => {
          const rooms = await prisma.room.findMany({
            where: {
              OR: [{ user1Id: targetUserId }, { user2Id: targetUserId }],
            },
            orderBy: { updatedAt: "desc" },
            include: {
              user1: {
                select: { id: true, fullname: true },
              },
              user2: {
                select: { id: true, fullname: true },
              },
            },
          });

          return Promise.all(
            rooms.map(async (room) => {
              const partner =
                room.user1Id === targetUserId ? room.user2 : room.user1;
              const isActive = connectedUserIds.includes(partner?.id as string);

              const redisKey = `room:${room.id}:messages`;
              const unreadKey = `room:${room.id}:unread:${targetUserId}`;

              // Get the latest message from Redis
              const buffered = await redisClient.lrange(redisKey, -1, -1);
              const lastMessage =
                buffered.length > 0 ? JSON.parse(buffered[0]) : null;

              // Get unread count from Redis (fallback to 0 if not found)
              const unreadCountStr = await redisClient.get(unreadKey);
              const unreadCount = parseInt(unreadCountStr || "0", 10);

              // Determine content
              const lastMessageContent =
                lastMessage?.content ||
                (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

              return {
                roomId: room.id,
                partner: {
                  id: partner?.id,
                  fullName: partner?.fullname,
                  // profileImage: partner?.profileImage,
                  isActive,
                },
                lastMessage: lastMessage
                  ? {
                      content: lastMessageContent,
                      createdAt: lastMessage?.createdAt || null,
                    }
                  : null,
                unreadCount,
              };
            }),
          );
        };

        const groupConversationForUser = async (targetUserId: string) => {
          const groups = await prisma.group.findMany({
            where: {
              memberIds: {
                has: targetUserId,
              },
            },
            orderBy: { updatedAt: "desc" },
          });

          return Promise.all(
            groups.map(async (room) => {
              const redisKey = `group:${room.id}:messages`;
              const unreadKey = `group:${room.id}:unread:${targetUserId}`;
              const unreadCount = parseInt(
                (await redisClient.get(unreadKey)) || "0",
                10,
              );

              // Get the latest message from Redis
              const buffered = await redisClient.lrange(redisKey, -1, -1);
              const lastMessage =
                buffered.length > 0 ? JSON.parse(buffered[0]) : null;

              // Determine content
              const lastMessageContent =
                lastMessage?.content ||
                (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

              return {
                roomId: room.id,
                groupName: room.groupName,
                groupPhoto: room.groupPhoto,
                lastMessage: lastMessage
                  ? {
                      content: lastMessageContent,
                      createdAt: lastMessage?.createdAt || null,
                    }
                  : null,
                unreadCount,
              };
            }),
          );
        };

        switch (type) {
          case "member-subscribe": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiverId is required",
                }),
              );
            }

            let room =
              (await prisma.room.findFirst({
                where: {
                  OR: [
                    { user1Id: userId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: userId },
                  ],
                },
              })) ||
              (await prisma.room.create({
                data: { user1Id: userId, user2Id: receiverId },
              }));

            roomId = room.id;

            const unreadKey = `room:${roomId}:unread:${userId}`;
            await redisClient.set(unreadKey, "0");

            roomUsers.forEach((clients, key) => {
              if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) roomUsers.delete(key);
              }
            });

            if (!roomUsers.has(roomId)) {
              roomUsers.set(roomId, new Set());
            }
            roomUsers.get(roomId)?.add(ws);

            const redisKey = `room:${roomId}:messages`;
            const redisRaw = await redisClient.lrange(redisKey, -15, -1);
            const messages = redisRaw.reverse().map((msg) => JSON.parse(msg));

            ws.send(
              JSON.stringify({
                type: "past-messages",
                roomId,
                messages: messages,
              }),
            );

            break;
          }

          case "member-send-message": {
            if (!roomId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to any room",
                }),
              );
            }

            const roomInfo = await prisma.room.findUnique({
              where: { id: roomId },
              select: { user1Id: true, user2Id: true },
            });

            if (!roomInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Room not found",
                }),
              );
            }

            const messagePayload = {
              content,
              user1Id: userId,
              user2Id: receiverId,
              roomId,
              fileUrl,
              createdAt: new Date().toISOString(),
            };

            const redisKey = `room:${roomId}:messages`;
            await redisClient.rpush(redisKey, JSON.stringify(messagePayload));
            const unreadKey = `room:${roomId}:unread:${receiverId}`;
            await redisClient.incr(unreadKey);
            const count = await redisClient.llen(redisKey);

            if (count >= 30) {
              const messagesToSaveRaw = await redisClient.lrange(
                redisKey,
                0,
                14,
              );
              const messagesToSave = messagesToSaveRaw.map((msg) =>
                JSON.parse(msg),
              );

              await prisma.message.createMany({ data: messagesToSave });

              await redisClient.ltrim(redisKey, 15, -1);
            }

            // Update the room's updatedAt
            await prisma.room.update({
              where: {
                id: roomId,
              },
              data: {
                updatedAt: new Date(),
              },
            });

            const senderConversations = await getConversationsForUser(userId);
            ws.send(
              JSON.stringify({
                type: "member-conversation",
                conversations: senderConversations,
              }),
            );

            // Broadcast message to all room clients
            roomUsers.get(roomId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "member-new-message",
                    message: messagePayload,
                    roomId,
                  }),
                );
              }
            });

            // Send updated conversation list to receiver (if online)
            const target = Array.from(connectedUsers).find(
              (client) => client.userId === receiverId,
            );

            if (target) {
              const receiverConversations =
                await getConversationsForUser(receiverId);
              target.send(
                JSON.stringify({
                  type: "member-conversation",
                  conversations: receiverConversations,
                }),
              );
            }

            break;
          }

          case "member-conversation": {
            const conversations = await prisma.room.findMany({
              where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
              },
              orderBy: { updatedAt: "desc" },
              include: {
                user1: {
                  select: { id: true, fullname: true },
                },
                user2: {
                  select: { id: true, fullname: true },
                },
              },
            });

            const connectedUserIds = Array.from(connectedUsers)
              .map((ws) => ws.userId)
              .filter((id) => id !== undefined);

            const formattedConversations = await Promise.all(
              conversations.map(async (room) => {
                const partner =
                  room.user1Id === userId ? room.user2 : room.user1;
                const isActive = connectedUserIds.includes(
                  partner?.id as string,
                );

                const redisKey = `room:${room.id}:messages`;
                const unreadKey = `room:${room.id}:unread:${userId}`;

                // Get the latest message from Redis (most recent at the end)
                const latestRaw = await redisClient.lrange(redisKey, -1, -1);
                const latestMsg =
                  latestRaw.length > 0 ? JSON.parse(latestRaw[0]) : null;

                // Get unread count from Redis
                const unreadCountStr = await redisClient.get(unreadKey);
                const unreadCount = parseInt(unreadCountStr || "0", 10);

                const latestMessage = latestMsg
                  ? {
                      content:
                        latestMsg.content ??
                        (latestMsg.fileUrl ? "sent file" : null),
                      createdAt: latestMsg.createdAt,
                    }
                  : null;

                return {
                  roomId: room.id,
                  partner: {
                    id: partner?.id,
                    fullName: partner?.fullname,
                    // profileImage: partner?.profileImage,
                    isActive,
                  },
                  lastMessage: latestMessage,
                  unreadCount,
                };
              }),
            );

            ws.send(
              JSON.stringify({
                type: "member-conversation",
                conversations: formattedConversations,
              }),
            );

            break;
          }

          case "group-subscribe": {
            if (!incomingGroupId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group ID is required",
                }),
              );
            }

            const isGroupAvailable = await prisma.group.findUnique({
              where: {
                id: incomingGroupId,
              },
            });
            if (!isGroupAvailable) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group not found",
                }),
              );
            }

            groupUsers.forEach((clients, key) => {
              if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) groupUsers.delete(key);
              }
            });

            if (!groupUsers.has(incomingGroupId)) {
              groupUsers.set(incomingGroupId, new Set());
            }
            groupUsers.get(incomingGroupId)?.add(ws);

            await redisClient.del(`group:${incomingGroupId}:unread:${userId}`);

            const redisKey = `group:${incomingGroupId}:messages`;
            const redisRaw = await redisClient.lrange(redisKey, -15, -1); // Get last 15
            const messages = redisRaw
              .reverse() // or .sort(...) if you prefer createdAt
              .map((msg) => JSON.parse(msg));

            ws.send(
              JSON.stringify({
                type: "group-messages",
                groupId: incomingGroupId,
                messages: messages,
              }),
            );
            groupId = incomingGroupId;

            break;
          }

          case "group-conversation": {
            const senderConversations = await groupConversationForUser(userId);
            ws.send(
              JSON.stringify({
                type: "group-conversation",
                conversations: senderConversations,
              }),
            );

            break;
          }

          case "send-group-message": {
            if (!groupId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribe any group",
                }),
              );
            }

            const userInfo = await prisma.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                fullname: true,
                // profileImage: true,
              },
            });

            if (!userInfo) {
              JSON.stringify({
                type: "error",
                message: "user not found",
              });
            }

            const groupInfo = await prisma.group.findUnique({
              where: { id: groupId },
            });

            if (!groupInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group not found",
                }),
              );
            }

            const messagePayload = {
              content,
              senderId: userId,
              fullname: userInfo?.fullname,
              // profileImage: userInfo?.profileImage,
              groupId,
              fileUrl,
              createdAt: new Date().toISOString(),
            };

            const redisKey = `group:${groupId}:messages`;
            await redisClient.rpush(redisKey, JSON.stringify(messagePayload));
            const count = await redisClient.llen(redisKey);

            if (count >= 30) {
              const messagesToSaveRaw = await redisClient.lrange(
                redisKey,
                0,
                14,
              );
              const messagesToSave = messagesToSaveRaw.map((msg) =>
                JSON.parse(msg),
              );

              await prisma.groupMessage.createMany({
                data: messagesToSave,
              });

              await redisClient.ltrim(redisKey, 15, -1);
            }

            const pipeline = redisClient.multi();
            for (const memberId of groupInfo.memberIds) {
              if (memberId !== userId) {
                pipeline.incr(`group:${groupId}:unread:${memberId}`);
              }
            }
            await pipeline.exec();

            await prisma.group.update({
              where: {
                id: groupId,
              },
              data: {
                updatedAt: new Date(),
              },
            });

            const senderConversations = await groupConversationForUser(userId);
            ws.send(
              JSON.stringify({
                type: "group-conversation",
                conversations: senderConversations,
              }),
            );

            // Broadcast message to all group clients
            groupUsers.get(groupId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "group-new-message",
                    message: messagePayload,
                    groupId,
                  }),
                );
              }
            });

            const members = groupInfo.memberIds;

            for (const memberId of members) {
              const target = Array.from(connectedUsers).find(
                (c) => c.userId === memberId,
              );

              if (target) {
                const conversations = await groupConversationForUser(memberId);

                target.send(
                  JSON.stringify({
                    type: "group-conversation",
                    conversations,
                  }),
                );
              }
            }
            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message type",
              }),
            );
        }
      } catch (err: unknown) {
        if (err instanceof SyntaxError) {
          ws.send(JSON.stringify({ type: "error", message: "Bad JSON" }));
        } else if (err instanceof Error) {
          ws.send(JSON.stringify({ type: "error", message: err }));
        } else {
          ws.send(
            JSON.stringify({ type: "error", message: "Unexpected error" }),
          );
        }
      }
    });

    ws.on("close", async () => {
      connectedUsers?.delete(ws);

      if (roomId) {
        const clients = roomUsers.get(roomId);
        clients?.delete(ws);
        if (clients?.size === 0) roomUsers.delete(roomId);
      }
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss, roomUsers };
