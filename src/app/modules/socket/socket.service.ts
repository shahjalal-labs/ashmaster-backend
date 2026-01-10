import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { WebSocket } from "ws";
import { CustomWebSocket } from "./socket.interface";

export const verifyWsToken = (ws: CustomWebSocket, token: string) => {
  if (!token) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not authenticated. Please login first.",
      }),
    );
  }
  try {
    let decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret,
    );
    return decoded;
  } catch (error: any) {
    let message =
      error.name === "TokenExpiredError"
        ? "Token is expired. Please re login !!!"
        : "Invalid token. Login for revalidate !!!";

    ws.send(
      JSON.stringify({
        type: "error",
        message,
      }),
    );
    return null;
  }
};
