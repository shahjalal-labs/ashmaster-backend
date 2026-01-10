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
    // const { authToken } = req.query.authToken;
    const authToken = req.headers?.token;
    console.log(authToken, "socket.controller.ts", 16);

    const decoded = verifyWsToken(ws, authToken as string);
    console.log(decoded, "socket.controller.ts", 20);

    // if we dont do this it will still go next and send the belows event
    if (!decoded) return;

    ws.send(
      JSON.stringify({
        type: "any type",
        data: "any data",
      }),
    );

    wsSendResponse({
      ws,
    });
  });
};
