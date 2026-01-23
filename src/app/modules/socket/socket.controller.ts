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
  connectionId: string; // Unique connection identifier
  lastActivity: number;
}

// Store connected users: userId -> Map<connectionId, WebSocket>
const userConnections = new Map<string, Map<string, UserSocket>>();

// Store connection ID to user ID mapping
const connectionToUser = new Map<string, string>();

// Store room subscribers: roomId -> Set<connectionId>
const roomSubscribers = new Map<string, Set<string>>();

// Generate unique connection ID
const generateConnectionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  // Clear Redis online status on server start
  wss.on("listening", async () => {
    console.log("🚀 WebSocket server started, clearing stale connections...");
    await chatRedisService.clearOnlineSet();
  });

  wss.on("connection", async (ws: UserSocket, req) => {
    // 1. GENERATE UNIQUE CONNECTION ID
    const connectionId = generateConnectionId();
    ws.connectionId = connectionId;
    ws.isAlive = true;
    ws.subscribedRooms = new Set();
    ws.lastActivity = Date.now();

    // 2. AUTHENTICATE USER
    const token = req.headers.token as string;
    const decoded = verifyWsToken(ws, token);

    if (!decoded) {
      ws.close();
      return;
    }

    const userId = decoded.id;
    ws.userId = userId;

    // 3. CLEANUP PREVIOUS CONNECTIONS FOR SAME USER
    // cleanupUserConnections(userId);

    // 4. ADD USER TO CONNECTION MAPS
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Map());
    }
    userConnections.get(userId)!.set(connectionId, ws);
    connectionToUser.set(connectionId, userId);

    // 5. SET USER ONLINE IN REDIS
    await chatRedisService.setUserOnline(userId);

    console.log(
      `✅ User ${userId} connected (${connectionId}). Total connections: ${connectionToUser.size}`,
    );

    // 6. SEND USER'S EXISTING CONVERSATIONS
    try {
      const conversations = await getUserChatRooms(userId, 20);

      // Also get online status for users in conversations
      const onlineUsers = await chatRedisService.getOnlineUsers();

      // Enhance conversations with online status
      const enhancedConversations = conversations.map((conv) => {
        if (conv.partner) {
          return {
            ...conv,
            partner: {
              ...conv.partner,
              online: onlineUsers.includes(conv.partner.id),
            },
          };
        }
        return conv;
      });

      ws.send(
        JSON.stringify({
          type: "conversations",
          conversations: enhancedConversations,
        }),
      );

      // Send online status update to others
      broadcastUserStatus(userId, true);
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
    }

    // 7. SET UP HEARTBEAT
    const heartbeat = setInterval(() => {
      if (!ws.isAlive) {
        console.log(`💔 Heartbeat failed for ${userId} (${connectionId})`);
        cleanupConnection(connectionId);
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    ws.on("pong", () => {
      ws.isAlive = true;
      ws.lastActivity = Date.now();
    });

    // 8. HANDLE INCOMING MESSAGES
    ws.on("message", async (rawData) => {
      try {
        ws.lastActivity = Date.now();
        const data = JSON.parse(rawData.toString());
        console.log(`📨 Message from ${userId} (${connectionId}):`, data.type);

        switch (data.type) {
          case "member-subscribe": {
            const { receiverId } = data;
            const result = await findOrCreateP2PRoom(userId, receiverId);

            // Subscribe to room
            subscribeToRoom(connectionId, result.room.id, ws);
            ws.activeRoomId = result.room.id;

            // Mark messages as read
            await chatRedisService.markAsRead(result.room.id, userId);

            // Get partner's online status
            const partnerOnline =
              await chatRedisService.isUserOnline(receiverId);

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: result.room.id,
                roomType: "P2P",
                isNewRoom: result.isNewRoom,
                initialMessages: result.initialMessages,
                partner: {
                  ...result.partner,
                  online: partnerOnline,
                },
              }),
            );

            // Update conversation list for both users
            updateConversationsForUsers([userId, receiverId]);
            break;
          }

          case "subscribe-room": {
            const { roomId } = data;

            // Verify user has access to this room
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
                  orderBy: { id: "desc" },
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

            // Subscribe to the room
            subscribeToRoom(connectionId, roomId, ws);
            ws.activeRoomId = roomId;

            // Get initial messages from Redis
            const initialMessages = await chatRedisService.getMessages(
              roomId,
              20,
            );

            // Mark messages as read
            await chatRedisService.markAsRead(roomId, userId);

            // Get partner/group details
            let partner = null;
            let roomName = "";
            let roomImage = null;
            let groupInfo = null;

            if (room.type === "P2P") {
              const partnerId = room.participants.find((id) => id !== userId);
              if (partnerId) {
                const partnerUser = await getUserDetails(partnerId);
                if (partnerUser) {
                  const isPartnerOnline =
                    await chatRedisService.isUserOnline(partnerId);
                  partner = {
                    id: partnerUser.id,
                    name: partnerUser.fullname,
                    image: partnerUser.profile?.profileImage,
                    online: isPartnerOnline,
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

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: room.id,
                roomType: room.type,
                isNewRoom: false,
                initialMessages: initialMessages.reverse(),
                partner,
                group: groupInfo,
                hasMoreMessages: initialMessages.length >= 20,
              }),
            );

            console.log(`User ${userId} subscribed to existing room ${roomId}`);
            break;
          }

          case "group-subscribe": {
            const { groupId } = data;
            const result = await findOrCreateGroupRoom(userId, groupId);

            // Subscribe to room
            subscribeToRoom(connectionId, result.room.id, ws);
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

            // Send only to sender (excluding sender from broadcast)
            ws.send(
              JSON.stringify({
                type: "message-sent",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
                timestamp: new Date().toISOString(),
              }),
            );

            // Broadcast to other room subscribers
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
                timestamp: new Date().toISOString(),
              },
              connectionId, // Exclude sender's connection
            );

            // Update conversation list for both users
            updateConversationsForUsers(result.participants);
            break;
          }

          case "group-send-message": {
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

            // Send confirmation to sender only
            ws.send(
              JSON.stringify({
                type: "message-sent",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
                timestamp: new Date().toISOString(),
              }),
            );

            // Broadcast to all room subscribers except sender
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
                timestamp: new Date().toISOString(),
              },
              connectionId, // Exclude sender's connection
            );

            // Update conversation list for all group members
            updateConversationsForUsers(result.participants);
            break;
          }

          case "typing": {
            const { roomId, isTyping = true } = data;

            // Broadcast typing indicator to room subscribers except sender
            broadcastToRoomSubscribers(
              roomId,
              "typing",
              {
                roomId,
                senderId: userId,
                isTyping,
              },
              connectionId,
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
              connectionId,
            );

            // Update conversation list for user
            updateConversationsForUsers([userId]);
            break;
          }

          case "get-more-messages": {
            const { roomId, before, limit = 20, page = 1 } = data;

            /*
             *
      roomId: string,
  limit: number,
  page: number,
  userId: string,
  before?: string,

             * */
            // Get older messages from database
            const olderMessages = await getOlderMessagesFromDB(
              roomId,
              limit,
              page,
              userId,
              before,
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
            unsubscribeFromRoom(connectionId, roomId, ws);
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
            const onlineUsersList = await chatRedisService.getOnlineUsers();

            const enhancedConversations = conversations.map((conv) => {
              if (conv.partner) {
                return {
                  ...conv,
                  partner: {
                    ...conv.partner,
                    online: onlineUsersList.includes(conv.partner.id),
                  },
                };
              }
              return conv;
            });

            ws.send(
              JSON.stringify({
                type: "conversations",
                conversations: enhancedConversations,
              }),
            );
            break;
          }

          case "ping": {
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
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

    // 9. HANDLE DISCONNECTION
    ws.on("close", async () => {
      console.log(`❌ User ${userId} (${connectionId}) disconnected`);
      cleanupConnection(connectionId);
      clearInterval(heartbeat);
    });

    // 10. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(
        `❌ WebSocket error for user ${userId} (${connectionId}):`,
        error,
      );
      cleanupConnection(connectionId);
    });
  });

  // Clean up inactive connections periodically (every 5 minutes)
  setInterval(() => {
    const now = Date.now();
    connectionToUser.forEach((userId, connId) => {
      const connections = userConnections.get(userId);
      if (connections) {
        const ws = connections.get(connId);
        if (ws && now - ws.lastActivity > 300000) {
          // 5 minutes inactivity
          console.log(
            `🕒 Cleaning up inactive connection: ${connId} for user ${userId}`,
          );
          cleanupConnection(connId);
          ws.terminate();
        }
      }
    });
  }, 60000);

  // Clear Redis online status on server start and cleanup periodically
  wss.on("listening", async () => {
    console.log("🚀 WebSocket server started, clearing stale connections...");

    // Clear online set on server start
    await chatRedisService.clearOnlineSet();

    // Cleanup stale online users every 30 seconds
    setInterval(async () => {
      await chatRedisService.cleanupStaleOnlineUsers();
    }, 30000);

    // Refresh online status for connected users every 2 minutes
    setInterval(async () => {
      userConnections.forEach(async (connections, userId) => {
        if (connections.size > 0) {
          await chatRedisService.refreshUserOnlineStatus(userId);
        }
      });
    }, 120000);
  });

  console.log(
    "✅ WebSocket server is running with improved connection management",
  );
  return wss;
};

// Helper functions
const cleanupUserConnections = (userId: string) => {
  const connections = userConnections.get(userId);
  if (connections) {
    connections.forEach((ws, connId) => {
      // Don't close if already closed
      if (
        ws.readyState !== WebSocket.CLOSED &&
        ws.readyState !== WebSocket.CLOSING
      ) {
        ws.close(1000, "New connection established");
      }
      cleanupConnection(connId);
    });
    connections.clear();
  }
};

const cleanupConnection = (connectionId: string) => {
  const userId = connectionToUser.get(connectionId);
  if (userId) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.delete(connectionId);
      if (connections.size === 0) {
        userConnections.delete(userId);
        // Set user offline in Redis after a delay
        setTimeout(async () => {
          const hasConnections = userConnections.has(userId);
          if (!hasConnections) {
            await chatRedisService.setUserOffline(userId);
            broadcastUserStatus(userId, false);
          }
        }, 5000);
      }
    }
    connectionToUser.delete(connectionId);

    // Unsubscribe from all rooms
    roomSubscribers.forEach((subscribers, roomId) => {
      if (subscribers.has(connectionId)) {
        subscribers.delete(connectionId);
        if (subscribers.size === 0) {
          roomSubscribers.delete(roomId);
        }
      }
    });
  }
};

const subscribeToRoom = (
  connectionId: string,
  roomId: string,
  ws: UserSocket,
) => {
  if (!roomSubscribers.has(roomId)) {
    roomSubscribers.set(roomId, new Set());
  }
  roomSubscribers.get(roomId)!.add(connectionId);

  if (ws.subscribedRooms) {
    ws.subscribedRooms.add(roomId);
  }
};

const unsubscribeFromRoom = (
  connectionId: string,
  roomId: string,
  ws: UserSocket,
) => {
  if (roomSubscribers.has(roomId)) {
    roomSubscribers.get(roomId)!.delete(connectionId);
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
  excludeConnectionId?: string,
) => {
  const subscribers = roomSubscribers.get(roomId);
  if (!subscribers) return;

  subscribers.forEach((connId) => {
    if (connId === excludeConnectionId) return;

    const userId = connectionToUser.get(connId);
    if (!userId) return;

    const connections = userConnections.get(userId);
    if (!connections) return;

    const subscriberWs = connections.get(connId);
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
  const onlineUsersList = await chatRedisService.getOnlineUsers();

  for (const userId of userIds) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.forEach(async (userWs) => {
        if (userWs.readyState === WebSocket.OPEN) {
          try {
            const conversations = await getUserChatRooms(userId, 20);

            // Enhance with online status
            const enhancedConversations = conversations.map((conv) => {
              if (conv.partner) {
                return {
                  ...conv,
                  partner: {
                    ...conv.partner,
                    online: onlineUsersList.includes(conv.partner.id),
                  },
                };
              }
              return conv;
            });

            userWs.send(
              JSON.stringify({
                type: "conversations-updated",
                conversations: enhancedConversations,
              }),
            );
          } catch (error) {
            console.error(
              `❌ Failed to update conversations for ${userId}:`,
              error,
            );
          }
        }
      });
    }
  }
};

const getOlderMessagesFromDB = async (
  roomId: string,
  limit: number,
  page: number,
  userId: string,
  before?: string,
) => {
  try {
    const beforeDate = new Date(before as string);
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: {
        roomId,
        // createdAt: { lt: beforeDate },
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
      orderBy: { id: "desc" },
      skip,
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

const broadcastUserStatus = (userId: string, isOnline: boolean) => {
  userConnections.forEach((connections, targetUserId) => {
    if (targetUserId === userId) return; // Don't send to self

    connections.forEach((targetWs) => {
      if (targetWs.readyState === WebSocket.OPEN) {
        targetWs.send(
          JSON.stringify({
            type: "user-status-changed",
            userId,
            isOnline,
            timestamp: new Date().toISOString(),
          }),
        );
      }
    });
  });
};
