import { Worker } from "bullmq";
import redisClient from "../../shared/redis";
import {
  sendNotifToManyUser,
  sendSingleNotification,
} from "../../app/modules/Notification/notification.service";
import { NotificationChannel, NotificationType } from "@prisma/client";

new Worker(
  "notifications_bridge_connections",
  async (job) => {
    const { name, data } = job;
    switch (name) {
      // new schedule
      case "newSchedule": {
        const { paylaod, userId, scheduleId } = data;

        await sendNotifToManyUser(
          paylaod.guestIds,
          `New Schedule: ${paylaod.title}`,
          paylaod.description,
          NotificationType.SCHEDULE,
          NotificationChannel.BOTH,
          userId,
          { scheduleId },
        );
        break;
      }
      // new connection request notif
      case "requestToConnect": {
        const { receiverId, userId, fullname, requestId } = data;
        await sendSingleNotification(
          receiverId,
          "New connection request",
          `${fullname} has sent you a connection request`,
          "CONNECTIONS",
          "BOTH",
          userId, // senderId
          {
            requestId,
          },
        );
        break;
      }
    }
  },
  {
    connection: redisClient,
  },
);
