import { Worker } from "bullmq";
import redisClient from "../../shared/redis";
import { sendNotifToManyUser } from "../../app/modules/Notification/notification.service";
import { NotificationChannel, NotificationType } from "@prisma/client";

new Worker(
  "notifications_bridge_connections",
  async (job) => {
    const { name, data } = job;
    const { paylaod, userId, scheduleId } = data;
    console.log(paylaod, userId, scheduleId, name, data);
    switch (name) {
      case "newSchedule": {
        await sendNotifToManyUser(
          paylaod.guestIds,
          `New Schedule: ${paylaod.title}`,
          paylaod.description,
          NotificationType.SCHEDULE,
          NotificationChannel.BOTH,
          userId,
          { scheduleId },
        );
      }
    }
  },
  {
    connection: redisClient,
  },
);
