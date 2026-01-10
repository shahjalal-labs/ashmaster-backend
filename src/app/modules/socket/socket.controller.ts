import { Request } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { CustomWebSocket } from "./socket.interface";
import { verifyWsToken } from "./socket.service";
let wss;

export const webSocketServerSetup = (server: Server) => {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    // const { authToken } = req.query.authToken;
    const authToken = req.query?.authToken;

    const decoded = verifyWsToken(ws, authToken as string);
    console.log(decoded, "socket.controller.ts", 20);

    ws.send(
      JSON.stringify({
        type: "group-conversation",
        data: "hasn",
      }),
    );
  });
};
