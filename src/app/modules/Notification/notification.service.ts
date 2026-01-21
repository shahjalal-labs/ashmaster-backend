import { NotificationType } from "@prisma/client";
import prisma from "../../../shared/prisma";
import admin from "../../../helpers/firebaseAdmin";

export const sendSingleNotification = async (
  receiverId: string,
  title: string,
  body: string,
  type: NotificationType,
  senderId?: string,
  handlerId?: string,
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!userInfo) return;
  /* if (!userInfo.fcmToken) {
    await prisma.notification.create({
      data: {
        receiverId,
        title,
        body,
        type: type,
        handlerId: handlerId,
        senderId: senderId,
      },
    });
    return;
  } */

  await prisma.notification.create({
    data: {
      receiverId,
      title,
      body,
      senderId,
      type: type,
      handlerId: handlerId,
    },
  });

  if (userInfo.fcmToken.length === 0) {
    console.warn(`No token found for sending notification`);
    return;
  }

  try {
    const tokens = userInfo.fcmToken; // array of tokens

    if (tokens.length > 0) {
      const message = {
        notification: { title, body },
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(response, "fcm response", 55);

      // remove invalid tokens
      const invalidTokens = response.responses
        .map((res, idx) => (!res.success ? tokens[idx] : null))
        .filter(Boolean) as string[];

      if (invalidTokens.length) {
        await prisma.user.update({
          where: { id: receiverId },
          data: {
            fcmToken: {
              set: userInfo.fcmToken.filter((t) => !invalidTokens.includes(t)),
            },
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const NotificationService = {
  sendSingleNotification,
};
