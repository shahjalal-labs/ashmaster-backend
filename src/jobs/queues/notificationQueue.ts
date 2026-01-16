import { Queue } from "bullmq";
import redisClient from "../../shared/redis";

export const notificationQueue = new Queue("notifications_bridge_connections", {
  connection: redisClient,
});

notificationQueue.add(
  "notify",
  {
    title: "Chat notification",
    body: "Hello! you have a new message from sara jensen",
  },
  {
    attempts: 3,
    timestamp: Date.now(),
  },
);
