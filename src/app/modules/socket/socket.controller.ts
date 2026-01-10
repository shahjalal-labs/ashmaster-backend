import { Request } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { CustomWebSocket } from "./socket.interface";
let wss;

export const webSocketServerSetup = (server: Server) => {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.query.token;
  });
};
