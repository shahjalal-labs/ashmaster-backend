import { CustomWebSocket } from "./socket.interface";

export const wsSendResponse = (
  ws: CustomWebSocket,
  type: string,
  {
    key,
    value,
  }: {
    key: string;
    value: any;
  },
) => {
  ws.send(
    JSON.stringify({
      type,
      [key]: value,
    }),
  );
};
