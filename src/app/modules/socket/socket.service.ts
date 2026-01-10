import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { WebSocket } from "ws";

export const verifyWsToken = (ws: WebSocket, token: string) => {
  if (!token) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not authenticated. Please login first",
      }),
    );
  }
  try {
    let decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret,
    );
  } catch (error) {}
};
