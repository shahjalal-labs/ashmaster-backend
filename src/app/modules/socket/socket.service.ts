import jwt from "jsonwebtoken";
import config from "../../../config";
import { WebSocket } from "ws";

// Simple function to verify WebSocket token
export const verifyWsToken = (ws: WebSocket, token: string) => {
  if (!token) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "No token provided",
      }),
    );
    ws.close();
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.jwt_secret as string);
    return decoded as { id: string };
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Invalid or expired token",
      }),
    );
    ws.close();
    return null;
  }
};
