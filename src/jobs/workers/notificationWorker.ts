import { Worker } from "bullmq";
import redisClient from "../../shared/redis";

new Worker(
  "notifications_bridge_connections",
  async (job) => {
    console.log(`job`, job);
    if (job.name === "notify") {
      console.log({
        [job.data]: "jobdata",
      });
    }
  },
  {
    connection: redisClient,
  },
);
