import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyWsToken } from "./socket.service";
import {
  findOrCreateP2PRoom,
  findOrCreateGroupRoom,
  sendP2PMessage,
  sendGroupMessage,
  getUserChatRooms,
  getUserDetails,
} from "./handlers/chat.handler";
import { chatRedisService } from "../../../shared/redis-services/chat.service";
import prisma from "../../../shared/prisma";

// Simple interface for our WebSocket
interface UserSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
  subscribedRooms?: Set<string>;
  activeRoomId?: string;
}

// Store connected users: userId -> WebSocket
const onlineUsers = new Map<string, UserSocket>();

// Store room subscribers: roomId -> Set<userId>
const roomSubscribers = new Map<string, Set<string>>();

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: UserSocket, req) => {
    // 1. AUTHENTICATE USER
    const token = req.headers.token as string;
    const decoded = verifyWsToken(ws, token);

    if (!decoded) {
      ws.close();
      return;
    }

    const userId = decoded.id;
    ws.userId = userId;
    ws.isAlive = true;
    ws.subscribedRooms = new Set();

    // 2. ADD USER TO ONLINE LIST & REDIS
    onlineUsers.set(userId, ws);
    await chatRedisService.setUserOnline(userId);

    console.log(
      `✅ User ${userId} connected. Online users: ${onlineUsers.size}`,
    );

    // 3. SEND USER'S EXISTING CONVERSATIONS (rooms with messages)
    try {
      const conversations = await getUserChatRooms(userId, 20);
      ws.send(
        JSON.stringify({
          type: "conversations",
          conversations,
        }),
      );
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
    }

    // 4. SET UP HEARTBEAT
    const heartbeat = setInterval(() => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // 5. HANDLE INCOMING MESSAGES
    ws.on("message", async (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());
        console.log(`📨 Message from ${userId}:`, data.type);

        switch (data.type) {
          case "member-subscribe": {
            // Subscribe to P2P chat with a user (create room if doesn't exist)
            const { receiverId } = data;

            const result = await findOrCreateP2PRoom(userId, receiverId);

            // Subscribe to room
            subscribeToRoom(userId, result.room.id, ws);
            ws.activeRoomId = result.room.id;

            // Mark messages as read
            await chatRedisService.markAsRead(result.room.id, userId);

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: result.room.id,
                roomType: "P2P",
                isNewRoom: result.isNewRoom,
                initialMessages: result.initialMessages,
                partner: result.partner,
              }),
            );

            // Update conversation list for both users
            updateConversationsForUsers([userId, receiverId]);
            break;
          }

          // Add this to the switch case in the message handler:
          case "subscribe-room": {
            const { roomId } = data;

            // 1. Verify user has access to this room
            const room = await prisma.chatRoom.findFirst({
              where: {
                id: roomId,
                participants: { has: userId },
              },
              include: {
                messages: {
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    sender: {
                      select: {
                        id: true,
                        fullname: true,
                        profile: {
                          select: {
                            profileImage: true,
                          },
                        },
                      },
                    },
                  },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
                group: {
                  select: {
                    id: true,
                    title: true,
                    groupPhoto: true,
                  },
                },
              },
            });

            if (!room) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You don't have access to this room",
                }),
              );
              break;
            }

            // 2. Subscribe to the room
            subscribeToRoom(userId, roomId, ws);
            ws.activeRoomId = roomId;

            // 3. Get initial messages from Redis (latest 20)
            const initialMessages = await chatRedisService.getMessages(
              roomId,
              20,
            );

            // 4. Mark messages as read
            await chatRedisService.markAsRead(roomId, userId);

            // 5. Get partner/group details
            let partner = null;
            let roomName = "";
            let roomImage = null;
            let groupInfo = null;

            if (room.type === "P2P") {
              const partnerId = room.participants.find((id) => id !== userId);
              if (partnerId) {
                const partnerUser = await getUserDetails(partnerId);
                if (partnerUser) {
                  partner = {
                    id: partnerUser.id,
                    name: partnerUser.fullname,
                    image: partnerUser.profile?.profileImage,
                    online: await chatRedisService.isUserOnline(partnerId),
                  };
                  roomName = partnerUser.fullname;
                  roomImage = partnerUser.profile?.profileImage;
                }
              }
            } else if (room.type === "GROUP") {
              if (room.group) {
                roomName = room.group.title;
                roomImage = room.group.groupPhoto;
                groupInfo = {
                  id: room.group.id,
                  title: room.group.title,
                  photo: room.group.groupPhoto,
                };
              }
            }

            // 6. Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: room.id,
                roomType: room.type,
                isNewRoom: false,
                initialMessages: initialMessages.reverse(), // Oldest to newest
                partner,
                group: groupInfo,
                hasMoreMessages: initialMessages.length >= 20,
              }),
            );

            console.log(
              `👥 User ${userId} subscribed to existing room ${roomId}`,
            );
            break;
          }

          case "group-subscribe": {
            // Subscribe to group chat
            const { groupId } = data;

            const result = await findOrCreateGroupRoom(userId, groupId);

            // Subscribe to room
            subscribeToRoom(userId, result.room.id, ws);
            ws.activeRoomId = result.room.id;

            // Mark messages as read
            await chatRedisService.markAsRead(result.room.id, userId);

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: result.room.id,
                roomType: "GROUP",
                isNewRoom: result.isNewRoom,
                initialMessages: result.initialMessages,
                group: result.group,
              }),
            );

            // Update conversation list for all group members
            updateConversationsForUsers(result.room.participants);
            break;
          }

          case "member-send-message": {
            // Send message in P2P room
            const { roomId, content, fileUrl } = data;

            // Verify user is subscribed to this room
            if (!ws.subscribedRooms?.has(roomId)) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to this room",
                }),
              );
              break;
            }

            const result = await sendP2PMessage(
              roomId,
              userId,
              content,
              fileUrl,
            );

            // Send to sender
            ws.send(
              JSON.stringify({
                type: "new-message",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
              }),
            );

            // Broadcast to other room subscribers (including receiver)
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
              },
              userId, // Exclude sender
            );

            // Update conversation list for both users
            updateConversationsForUsers(result.participants);
            break;
          }

          case "group-send-message": {
            // Send message in group room
            const { roomId, content, fileUrl } = data;

            // Verify user is subscribed to this room
            if (!ws.subscribedRooms?.has(roomId)) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to this room",
                }),
              );
              break;
            }

            const result = await sendGroupMessage(
              roomId,
              userId,
              content,
              fileUrl,
            );

            // Send to sender
            ws.send(
              JSON.stringify({
                type: "new-message",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
              }),
            );

            // Broadcast to all room subscribers
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
              },
              userId, // Exclude sender
            );

            // Update conversation list for all group members
            updateConversationsForUsers(result.participants);
            break;
          }

          case "typing": {
            const { roomId, isTyping = true } = data;

            // Broadcast typing indicator to room subscribers
            broadcastToRoomSubscribers(
              roomId,
              "typing",
              {
                roomId,
                senderId: userId,
                isTyping,
              },
              userId,
            );
            break;
          }

          case "mark-read": {
            const { roomId } = data;
            await chatRedisService.markAsRead(roomId, userId);

            // Notify room subscribers that messages are read
            broadcastToRoomSubscribers(
              roomId,
              "messages-read",
              {
                roomId,
                userId,
              },
              userId,
            );

            // Update conversation list for user
            updateConversationsForUsers([userId]);
            break;
          }

          case "get-more-messages": {
            const { roomId, before, limit = 20 } = data;

            // Get older messages from database
            const olderMessages = await getOlderMessagesFromDB(
              roomId,
              before,
              limit,
              userId,
            );

            ws.send(
              JSON.stringify({
                type: "more-messages",
                roomId,
                messages: olderMessages.messages,
                hasMore: olderMessages.hasMore,
                before: olderMessages.newBefore,
              }),
            );
            break;
          }

          case "unsubscribe-room": {
            const { roomId } = data;
            unsubscribeFromRoom(userId, roomId, ws);
            ws.activeRoomId = undefined;

            ws.send(
              JSON.stringify({
                type: "room-unsubscribed",
                roomId,
              }),
            );
            break;
          }

          case "get-conversations": {
            const conversations = await getUserChatRooms(userId, 20);
            ws.send(
              JSON.stringify({
                type: "conversations",
                conversations,
              }),
            );
            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Unknown message type",
              }),
            );
        }
      } catch (error: any) {
        console.error("❌ Error handling message:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message || "Failed to process message",
          }),
        );
      }
    });

    // 6. HANDLE DISCONNECTION
    ws.on("close", async () => {
      console.log(`❌ User ${userId} disconnected`);

      // Unsubscribe from all rooms
      if (ws.subscribedRooms) {
        ws.subscribedRooms.forEach((roomId) => {
          unsubscribeFromRoom(userId, roomId, ws);
        });
      }

      // Remove from online users
      onlineUsers.delete(userId);

      // Mark as offline in Redis
      setTimeout(async () => {
        if (!onlineUsers.has(userId)) {
          await chatRedisService.setUserOffline(userId);
          broadcastToUserConnections(userId, "user-offline", { userId });
        }
      }, 5000);

      // Clean up heartbeat
      clearInterval(heartbeat);
    });

    // 7. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error);
    });
  });

  // Helper functions
  const subscribeToRoom = (userId: string, roomId: string, ws: UserSocket) => {
    if (!roomSubscribers.has(roomId)) {
      roomSubscribers.set(roomId, new Set());
    }
    roomSubscribers.get(roomId)!.add(userId);

    if (ws.subscribedRooms) {
      ws.subscribedRooms.add(roomId);
    }
  };

  const unsubscribeFromRoom = (
    userId: string,
    roomId: string,
    ws: UserSocket,
  ) => {
    if (roomSubscribers.has(roomId)) {
      roomSubscribers.get(roomId)!.delete(userId);
      if (roomSubscribers.get(roomId)!.size === 0) {
        roomSubscribers.delete(roomId);
      }
    }

    if (ws.subscribedRooms) {
      ws.subscribedRooms.delete(roomId);
    }
  };

  const broadcastToRoomSubscribers = (
    roomId: string,
    type: string,
    payload: any,
    excludeUserId?: string,
  ) => {
    const subscribers = roomSubscribers.get(roomId);
    if (!subscribers) return;

    subscribers.forEach((subscriberId) => {
      if (subscriberId === excludeUserId) return;

      const subscriberWs = onlineUsers.get(subscriberId);
      if (subscriberWs && subscriberWs.readyState === WebSocket.OPEN) {
        subscriberWs.send(
          JSON.stringify({
            type,
            ...payload,
          }),
        );
      }
    });
  };

  const updateConversationsForUsers = async (userIds: string[]) => {
    for (const userId of userIds) {
      const userWs = onlineUsers.get(userId);
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        try {
          const conversations = await getUserChatRooms(userId, 20);
          userWs.send(
            JSON.stringify({
              type: "conversations-updated",
              conversations,
            }),
          );
        } catch (error) {
          console.error(
            `❌ Failed to update conversations for ${userId}:`,
            error,
          );
        }
      }
    }
  };

  const getOlderMessagesFromDB = async (
    roomId: string,
    before: string,
    limit: number,
    userId: string,
  ) => {
    try {
      const beforeDate = new Date(before);

      const messages = await prisma.message.findMany({
        where: {
          roomId,
          createdAt: { lt: beforeDate },
        },
        select: {
          id: true,
          content: true,
          fileUrl: true,
          senderId: true,
          readBy: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              fullname: true,
              profile: {
                select: {
                  profileImage: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      const hasMore = messages.length >= limit;
      const newBefore =
        messages.length > 0
          ? messages[messages.length - 1].createdAt.toISOString()
          : before;

      return {
        messages,
        hasMore,
        newBefore,
      };
    } catch (error) {
      console.error("❌ Error getting older messages:", error);
      throw error;
    }
  };

  const broadcastToUserConnections = (
    userId: string,
    type: string,
    payload: any,
  ) => {
    onlineUsers.forEach((userWs, wsUserId) => {
      if (wsUserId === userId) return;

      if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(
          JSON.stringify({
            type,
            ...payload,
          }),
        );
      }
    });
  };

  console.log("✅ WebSocket server is running with proper room flow");
  return wss;
};
