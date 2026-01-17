import { Worker } from "bullmq";
import redisClient from "../../shared/redis";

new Worker(
  "notifications_bridge_connections",
  async (job) => {
    if (job.name === "notify") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Blocks for 5 seconds

      setTimeout(() => {
        console.log({
          jobData: job.data,
        });
      }, 3500);
    }
  },
  {
    connection: redisClient,
  },
);
