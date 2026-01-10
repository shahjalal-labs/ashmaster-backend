import { CustomWebSocket } from "./socket.interface";

export const wsSendResponse = (
  ws: CustomWebSocket,
  type: string,
  payload: Record<string, unknown>,
) => {
  ws.send(
    JSON.stringify({
      type,
      payload,
    }),
  );
};
