// wsServer.ts
import { Server } from "http";
import prisma from "../../../shared/prisma";
import { WebSocket, WebSocketServer } from "ws";
import { verifyWsToken } from "./socket.service";

// Extend WebSocket to store user info
interface CustomWebSocket extends WebSocket {
  userId?: string;
  rooms?: Set<string>; // P2P rooms
  groups?: Set<string>; // group rooms
}

// Maps for room -> ws connections
const roomUsers = new Map<string, Set<CustomWebSocket>>(); // P2P rooms
const groupUsers = new Map<string, Set<CustomWebSocket>>(); // Group rooms
const connectedUsers = new Set<CustomWebSocket>();

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req) => {
    const token = req.headers.token as string;
    const decoded = verifyWsToken(ws, token);
    if (!decoded) return ws.close();

    ws.userId = decoded.id;
    ws.rooms = new Set();
    ws.groups = new Set();
    connectedUsers.add(ws);

    console.log(`User ${ws.userId} connected`);

    const userAllRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          has: ws.userId,
        },
      },
      include: {
        messages: {
          select: {
            content: true,
            fileUrl: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    ws.send(JSON.stringify({ type: "chatrooms", rooms: userAllRooms }));

    // Get all P2P chat rooms of this user
    const userRooms = await prisma.chatRoom.findMany({
      where: { type: "P2P", participants: { has: ws.userId } },
    });

    for (const room of userRooms) {
      ws.rooms!.add(room.id);
      if (!roomUsers.has(room.id)) roomUsers.set(room.id, new Set());
      roomUsers.get(room.id)!.add(ws);
    }

    // Similarly, join groups
    const groups = await prisma.group.findMany({
      where: { memberIds: { has: ws.userId } },
    });

    for (const group of groups) {
      ws.groups!.add(group.id);
      if (!groupUsers.has(group.id)) groupUsers.set(group.id, new Set());
      groupUsers.get(group.id)!.add(ws);
    }

    // Ping to detect dead connections
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    // --- Helper to join P2P room dynamically ---
    const joinRoom = (roomId: string) => {
      ws.rooms!.add(roomId);
      if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());
      roomUsers.get(roomId)!.add(ws);
    };

    // --- Helper to join Group room ---
    const joinGroup = (groupId: string) => {
      ws.groups!.add(groupId);
      if (!groupUsers.has(groupId)) groupUsers.set(groupId, new Set());
      groupUsers.get(groupId)!.add(ws);
    };

    // --- Handle incoming messages ---
    ws.on("message", async (rawData) => {
      try {
        const { type, payload } = JSON.parse(rawData.toString());

        switch (type) {
          case "p2p-message": {
            let isNewRoom = false;
            const { receiverId, content, fileUrl } = payload;

            // Find or create a P2P room
            let room = await prisma.chatRoom.findFirst({
              where: {
                type: "P2P",
                participants: { hasEvery: [ws.userId!, receiverId] },
              },
            });

            if (!room) {
              room = await prisma.chatRoom.create({
                data: { type: "P2P", participants: [ws.userId!, receiverId] },
              });

              isNewRoom = true;
            }

            const roomId = room.id;
            joinRoom(roomId);

            // Save message
            const message = await prisma.message.create({
              data: {
                roomId,
                senderId: ws.userId!,
                content,
                fileUrl: fileUrl,
                readBy: [ws.userId!],
              },
            });

            if (isNewRoom) {
              const roomPayload = {
                id: room.id,
                type: room.type,
                participants: room.participants,
                lastMessage: message,
              };

              room.participants.forEach((userId) => {
                connectedUsers.forEach((client) => {
                  if (
                    client.userId === userId &&
                    client.readyState === WebSocket.OPEN
                  ) {
                    client.send(
                      JSON.stringify({
                        type: "room-created",
                        room: roomPayload,
                      }),
                    );
                  }
                });
              });
            }

            /* await prisma.chatRoom.updateMany({
              where: {
                type: "P2P",
                participants: {
                  hasEvery: [ws.userId, receiverId],
                },
              },

              data: {
                updatedAt: new Date(),
              },
            }); */

            // Broadcast to room clients

            roomUsers.get(roomId)?.forEach((client) => {
              if (
                client.readyState === WebSocket.OPEN &&
                client.userId !== ws.userId
              ) {
                client.send(JSON.stringify({ type: "p2p-message", message }));
              }
            });

            break;
          }

          case "group-message": {
            const { groupId, content } = payload;
            const group = await prisma.group.findUnique({
              where: { id: groupId },
            });
            if (!group)
              return ws.send(
                JSON.stringify({ type: "error", message: "Group not found" }),
              );

            // Join group if not already
            joinGroup(groupId);

            // Find ChatRoom for this group
            let room = await prisma.chatRoom.findFirst({
              where: { type: "GROUP", groupId },
            });

            if (!room) {
              room = await prisma.chatRoom.create({
                data: { type: "GROUP", groupId, participants: group.memberIds },
              });
            }

            const message = await prisma.message.create({
              data: {
                roomId: room.id,
                senderId: ws.userId!,
                content,
                fileUrl: [],
                readBy: [ws.userId!],
              },
            });

            // Broadcast to all group members
            groupUsers.get(groupId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "group-message", message }));
              }
            });

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
      } catch (err) {
        console.error(err);
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(ws);
      ws.rooms?.forEach((roomId) => {
        const clients = roomUsers.get(roomId);
        clients?.delete(ws);
        if (clients?.size === 0) roomUsers.delete(roomId);
      });

      ws.groups?.forEach((groupId) => {
        const clients = groupUsers.get(groupId);
        clients?.delete(ws);
        if (clients?.size === 0) groupUsers.delete(groupId);
      });

      clearInterval(pingInterval);
      console.log(`User ${ws.userId} disconnected`);
    });
  });
};
