import { Worker } from "bullmq";
import redisClient from "../../shared/redis";

new Worker(
  "notifications_bridge_connections",
  async (job) => {
    if (job.name === "notify") {
      console.log("notification worker processing");
    }
  },
  {
    connection: redisClient,
  },
);
