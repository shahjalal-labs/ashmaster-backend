import { Request } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { CustomWebSocket } from "./socket.interface";
import { verifyWsToken } from "./socket.service";
import { wsSendResponse } from "./websocketSendResponse";
let wss;

export const webSocketServerSetup = (server: Server) => {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.headers.token;

    const decoded = verifyWsToken(ws, authToken as string);
    console.log(decoded, "socket.controller.ts", 20);

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

    type TData = {
      type: string;
      payload: any;
    };

    ws.on("message", async (data: TData) => {
      const message = {
        ...JSON.parse(data),
        userId: ws.userId,
      };

      wsSendResponse(ws, "new message", {
        message,
      });
    });
  });
};
