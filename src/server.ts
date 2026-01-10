import { Server } from "http";
import app from "./app";
import config from "./config";
import { WebSocket } from "ws";
import { webSocketServerSetup } from "./app/modules/socket/socket.controller";

// let server: Server;

// ruhul
async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("✅ Server is running on", `http://localhost:${config.port}`);

    console.log(
      "📊 BullMQ Dashboard at",

      `http://localhost:${6011}/admin/queues`,
    );
  });

  webSocketServerSetup(server);

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
