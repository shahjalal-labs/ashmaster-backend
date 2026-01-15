import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyWsToken } from "./socket.service";
import {
  handleP2PMessage,
  handleGroupMessage,
  getUserChatRooms,
  getRoomMessages,
} from "./handlers/chat.handler";
import { chatRedisService } from "../../../shared/redis-services/chat.service";
import prisma from "../../../shared/prisma";

// Simple interface for our WebSocket
interface UserSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

// Store connected users: userId -> WebSocket
const onlineUsers = new Map<string, UserSocket>();

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

    // 2. ADD USER TO ONLINE LIST & REDIS
    onlineUsers.set(userId, ws);
    await chatRedisService.setUserOnline(userId);

    console.log(
      `✅ User ${userId} connected. Online users: ${onlineUsers.size}`,
    );

    // 3. BROADCAST ONLINE STATUS TO USER'S CONNECTIONS
    broadcastToUserConnections(userId, "user-online", { userId });

    // 4. SEND USER'S CHAT ROOMS
    try {
      const rooms = await getUserChatRooms(userId, 20);
      ws.send(
        JSON.stringify({
          type: "chatrooms",
          rooms,
        }),
      );
    } catch (error) {
      console.error("❌ Failed to fetch chat rooms:", error);
    }

    // 5. SET UP HEARTBEAT (keep connection alive)
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

    // 6. HANDLE INCOMING MESSAGES
    ws.on("message", async (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());
        console.log(`📨 Message from ${userId}:`, data.type);

        switch (data.type) {
          case "p2p-message": {
            const { receiverId, content, fileUrl } = data;

            // Save and process message
            const result = await handleP2PMessage(
              userId,
              receiverId,
              content,
              fileUrl,
            );

            // Send to receiver if online
            const receiverWs = onlineUsers.get(receiverId);
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(
                JSON.stringify({
                  type: "p2p-message",
                  message: result.message,
                  roomId: result.roomId,
                  senderId: userId,
                  isNewRoom: result.isNewRoom,
                }),
              );
            }

            // Send confirmation to sender
            ws.send(
              JSON.stringify({
                type: "message-sent",
                messageId: result.message.id,
                roomId: result.roomId,
              }),
            );

            // Update chat rooms for both users
            updateChatRoomsForUsers([userId, receiverId]);
            break;
          }

          case "group-message": {
            const { groupId, content, fileUrl } = data;

            // Save and process group message
            const result = await handleGroupMessage(
              userId,
              groupId,
              content,
              fileUrl,
            );

            // Send to all online group members except sender
            result.participants.forEach((memberId) => {
              if (memberId !== userId) {
                const memberWs = onlineUsers.get(memberId);
                if (memberWs && memberWs.readyState === WebSocket.OPEN) {
                  memberWs.send(
                    JSON.stringify({
                      type: "group-message",
                      message: result.message,
                      roomId: result.roomId,
                      senderId: userId,
                      groupId,
                    }),
                  );
                }
              }
            });

            // Send confirmation to sender
            ws.send(
              JSON.stringify({
                type: "group-message-sent",
                messageId: result.message.id,
                roomId: result.roomId,
              }),
            );

            // Update chat rooms for all group members
            updateChatRoomsForUsers(result.participants);
            break;
          }

          case "typing": {
            const { receiverId, roomId } = data;
            const receiverWs = onlineUsers.get(receiverId);

            if (receiverWs) {
              receiverWs.send(
                JSON.stringify({
                  type: "typing",
                  senderId: userId,
                  roomId,
                  isTyping: true,
                }),
              );
            }
            break;
          }

          case "typing-stop": {
            const { receiverId, roomId } = data;
            const receiverWs = onlineUsers.get(receiverId);

            if (receiverWs) {
              receiverWs.send(
                JSON.stringify({
                  type: "typing",
                  senderId: userId,
                  roomId,
                  isTyping: false,
                }),
              );
            }
            break;
          }

          case "mark-read": {
            const { roomId } = data;
            await chatRedisService.markAsRead(roomId, userId);

            // Notify others in the room that messages are read
            const room = await prisma.chatRoom.findUnique({
              where: { id: roomId },
              select: { participants: true },
            });

            if (room) {
              room.participants.forEach((participantId) => {
                if (participantId !== userId) {
                  const participantWs = onlineUsers.get(participantId);
                  if (participantWs) {
                    participantWs.send(
                      JSON.stringify({
                        type: "messages-read",
                        roomId,
                        userId,
                      }),
                    );
                  }
                }
              });
            }
            break;
          }

          case "get-messages": {
            const { roomId, limit = 50 } = data;
            const result = await getRoomMessages(roomId, userId, limit);

            ws.send(
              JSON.stringify({
                type: "room-messages",
                roomId,
                messages: result.messages,
                hasMore: result.hasMore,
              }),
            );
            break;
          }

          case "get-more-messages": {
            const { roomId, before, limit = 20 } = data;
            // This would fetch older messages from database
            // Implement pagination based on before timestamp
            ws.send(
              JSON.stringify({
                type: "more-messages",
                roomId,
                messages: [], // Implement pagination logic here
                hasMore: false,
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

    // 7. HANDLE DISCONNECTION
    ws.on("close", async () => {
      console.log(`❌ User ${userId} disconnected`);

      // Remove from online users
      onlineUsers.delete(userId);

      // Mark as offline in Redis with delay
      setTimeout(async () => {
        // Check if user reconnected in the meantime
        if (!onlineUsers.has(userId)) {
          await chatRedisService.setUserOffline(userId);
          broadcastToUserConnections(userId, "user-offline", { userId });
        }
      }, 5000); // 5 second delay to handle reconnections

      // Clean up heartbeat
      clearInterval(heartbeat);
    });

    // 8. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error);
    });
  });

  // Function to broadcast to all connections of a user
  const broadcastToUserConnections = (
    userId: string,
    type: string,
    payload: any,
  ) => {
    // This would get all users who have chat rooms with this user
    // For simplicity, we'll implement this based on your requirements
  };

  // Function to update chat rooms for users
  const updateChatRoomsForUsers = async (userIds: string[]) => {
    for (const userId of userIds) {
      const userWs = onlineUsers.get(userId);
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        try {
          const rooms = await getUserChatRooms(userId, 20);
          userWs.send(
            JSON.stringify({
              type: "chatrooms-updated",
              rooms,
            }),
          );
        } catch (error) {
          console.error(`❌ Failed to update rooms for ${userId}:`, error);
        }
      }
    }
  };

  console.log("✅ WebSocket server is running");
  return wss;
};
