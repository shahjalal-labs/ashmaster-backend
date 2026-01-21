import { NotificationType } from "@prisma/client";
import prisma from "../../../shared/prisma";

export const sendSingleNotification = async (
  receiverId: string,
  title: string,
  body: string,
  type: NotificationType,
  handlerId?: string,
  senderId?: string,
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

        senderId: senderId,
      },
    });
    return;
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: userInfo.fcmToken,
  };

  await prisma.notification.create({
    data: {
      userId: receiverId,
      title,
      body,
      senderId,
      type: type,
      handlerId: handlerId,
    },
  });

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};
