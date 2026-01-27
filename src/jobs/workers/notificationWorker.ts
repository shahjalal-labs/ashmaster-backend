import { Worker } from "bullmq";
import redisClient from "../../shared/redis";

new Worker(
  "notifications_bridge_connections",
  async (job) => {
    const { name } = job;
    switch (name) {
      case "": {
      }
    }
  },
  {
    connection: redisClient,
  },
);
