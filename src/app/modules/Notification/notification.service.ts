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
  if (!userInfo.fcmToken) {
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
  }

  const tokens = userInfo.fcmToken;

  if (tokens.length) {
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: userInfo.fcmToken,
  };

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

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};
