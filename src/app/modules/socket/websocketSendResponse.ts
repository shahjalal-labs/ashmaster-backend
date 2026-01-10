import { CustomWebSocket } from "./socket.interface";

type TWsSendResponse = {
  ws: CustomWebSocket;
  type: string;
  key: string;
  value: any;
};

export const webSocketSendResponse = (
  ws: CustomWebSocket,
  type: string,
  key: string,
  value: any,
) => {
  ws.send(
    JSON.stringify({
      type,
      [key]: value, // dynamic key
    }),
  );
};
