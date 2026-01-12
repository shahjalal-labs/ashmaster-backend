import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyWsToken } from "./socket.service";
import { handleP2PMessage, handleGroupMessage } from "./handlers/chat.handler";
import prisma from "../../../shared/prisma";

// Simple interface for our WebSocket
interface UserSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

// Store connected users: userId -> WebSocket
const onlineUsers = new Map<string, UserSocket>();

// Store room connections: roomId -> userId[]
const roomConnections = new Map<string, string[]>();

// Store group connections: groupId -> userId[]
const groupConnections = new Map<string, string[]>();

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

    // 2. ADD USER TO ONLINE LIST
    onlineUsers.set(userId, ws);
    console.log(`✅ User ${userId} connected`);

    // 4. SEND USER'S EXISTING CHAT ROOMS
    const userRooms = await prisma.chatRoom.findMany({
      where: { participants: { has: userId } },
      include: {
        messages: {
          select: {},
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    ws.send(
      JSON.stringify({
        type: "chatrooms",
        rooms: userRooms,
      }),
    );

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
            const { receiverId, content } = data;

            // Save message to database
            const result = await handleP2PMessage(userId, receiverId, content);

            // Send to receiver if online
            const receiverWs = onlineUsers.get(receiverId);
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(
                JSON.stringify({
                  type: "p2p-message",
                  message: result.message,
                  senderId: userId,
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

            break;
          }

          case "group-message": {
            const { groupId, content } = data;

            // Save message to database
            const result = await handleGroupMessage(userId, groupId, content);

            // Get group members
            const group = await prisma.group.findUnique({
              where: { id: groupId },
              select: { memberIds: true },
            });

            if (!group) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group not found",
                }),
              );
              break;
            }

            // Send to all online group members
            group.memberIds.forEach((memberId) => {
              if (memberId !== userId) {
                // Don't send to self
                const memberWs = onlineUsers.get(memberId);
                if (memberWs && memberWs.readyState === WebSocket.OPEN) {
                  memberWs.send(
                    JSON.stringify({
                      type: "group-message",
                      message: result.message,
                      groupId,
                      senderId: userId,
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
              }),
            );

            break;
          }

          case "typing": {
            // Notify the other user that typing is happening
            const { receiverId } = data;
            const receiverWs = onlineUsers.get(receiverId);

            if (receiverWs) {
              receiverWs.send(
                JSON.stringify({
                  type: "typing",
                  senderId: userId,
                  isTyping: true,
                }),
              );
            }
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
      } catch (error) {
        console.error("❌ Error handling message:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Failed to process message",
          }),
        );
      }
    });

    // 7. HANDLE DISCONNECTION
    ws.on("close", () => {
      console.log(`❌ User ${userId} disconnected`);

      // Remove from online users
      onlineUsers.delete(userId);

      // Clean up heartbeat
      clearInterval(heartbeat);
    });

    // 8. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error);
    });
  });

  console.log("✅ WebSocket server is running");
};
