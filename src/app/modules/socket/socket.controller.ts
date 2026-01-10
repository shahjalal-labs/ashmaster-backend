import { Request } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { CustomWebSocket } from "./socket.interface";
import { verifyWsToken } from "./socket.service";
import { wsSendResponse } from "./websocketSendResponse";
import { sendMessage } from "../chat/chat.service";

let wss;

export const webSocketServerSetup = (server: Server) => {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.headers.token;

    const decoded = verifyWsToken(ws, authToken as string);

    // if we dont do this it will still go next and send the belows event
    if (!decoded) return;

    ws.userId = decoded.id;

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
      const { type, payload } = JSON.parse(data);
      switch (type) {
        case "send-message": {
          sendMessage(ws.userId as string, payload);
        }
      }

      wsSendResponse(ws, "new message", {});
    });
  });
};
