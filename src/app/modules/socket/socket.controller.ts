import { Request } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { CustomWebSocket } from "./socket.interface";
import { verifyWsToken } from "./socket.service";
import { wsSendResponse } from "./websocketSendResponse";
import { sendMessage } from "../chat/chat.service";
import prisma from "../../../shared/prisma";

let wss;

const roomUsers = new Map<string, Set<CustomWebSocket>>();

const connectedUsers = new Set<CustomWebSocket>();

export const webSocketServerSetup = (server: Server) => {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.headers.token;

    const decoded = verifyWsToken(ws, authToken as string);

    // if we dont do this it will still go next and send the belows event
    if (!decoded) return;

    const userId = decoded.id;
    ws.userId = userId;
    connectedUsers.add(ws);
    if (!roomUsers.has(userId)) roomUsers.set(userId, new Set());
    roomUsers.get(userId)?.add(ws);

    // ping checking connection exist or not by getting pong from client, if pong not get then it will triggure close event
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    ws.send(
      JSON.stringify({
        type: "any type",
        payload: {
          conversation: [],
        },
      }),
    );

    wsSendResponse(ws, "group-conversation", {
      conversations: [],
    });

    ws.on("message", async (data: any) => {
      const { type, payload, recieverId, groupId } = JSON.parse(data);
      switch (type) {
        case "subscribe": {
          if (!recieverId) {
            return wsSendResponse(ws, "error", {
              message: "recieverId is required",
            });
          }
          const room = await prisma.chatRoom.findMany({
            where: {
              participants: {
                hasEvery: [userId, recieverId],
              },
            },
          });
        }
        case "send-message": {
          sendMessage(ws.userId as string, payload);
          break;
        }
      }
    });

    ws.on("close", () => {
      connectedUsers?.delete(ws);
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
};
