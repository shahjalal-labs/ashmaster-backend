import { Request } from "express";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { CustomWebSocket } from "./socket.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
let wss;

export const webSocketServerSetup = (server: Server) => {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    try {
      // const { authToken } = req.query.authToken;
      const authToken = req.query?.authToken;

      const decoded = jwtHelpers.verifyToken(authToken);
      console.log(
        {
          authToken,
        },
        "socket.controller.ts",
        14,
      );

      ws.send(
        JSON.stringify({
          type: "group-conversation",
          data: "hasn",
        }),
      );
    } catch (error: any) {
      console.log(error?.message, "socket.controller.ts", 30);
      // console.log(`error`, error);
    }
  });
};
