import { NotificationChannel, NotificationType } from "@prisma/client";
import prisma from "../../../shared/prisma";
import admin from "../../../helpers/firebaseAdmin";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { paginationHelper, TOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── sendSingleNotification ────────────╮
export const sendSingleNotification = async (
  receiverId: string,
  title: string,
  body: string,
  type: NotificationType,
  notificationChannel: NotificationChannel,
  senderId?: string,
  metaData?: any,
) => {
  const receiverInfo = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiverInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "reciever not found!");
  }
  await prisma.notification.create({
    data: {
      receiverId,
      title,
      body,
      senderId,
      notificationChannel,
      type: type,
      metaData,
    },
  });

  if (notificationChannel === NotificationChannel.INAPP) {
    console.log(`It's only an in app notification not push notify`);
    return;
  }

  if (receiverInfo.fcmToken.length === 0) {
    console.warn(`No token found for sending notification`);
    return;
  }

  try {
    const tokens = receiverInfo.fcmToken; // array of tokens

    if (tokens.length > 0) {
      const message = {
        notification: { title, body },
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(response, "fcm response", 54);

      // remove invalid tokens
      const invalidTokens = response.responses
        .map((res, idx) => (!res.success ? tokens[idx] : null))
        .filter(Boolean) as string[];

      if (invalidTokens.length) {
        await prisma.user.update({
          where: { id: receiverId },
          data: {
            fcmToken: {
              set: receiverInfo.fcmToken.filter(
                (t) => !invalidTokens.includes(t),
              ),
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
//w: (end)  ╰──────────── sendSingleNotification ────────────╯

//w: (start)╭──────────── getMyNotifications ────────────╮
const getMyNotifications = async (
  userId: string,
  options: TOptions,
  filter: boolean | string,
) => {
  const { page, skip, limit } = paginationHelper.calcalutePagination(options);

  let readStatus;

  switch (filter) {
    case true: {
      readStatus = true;
      break;
    }
  }

  const [data, total] = await Promise.all([
    prisma.notification.findMany({
      where: {
        receiverId: userId,
        ...(typeof filter === "boolean" ? { isRead: filter } : {}),
      },
      select: {
        id: true,
        title: true,
        body: true,
        isRead: true,
        metaData: true,
        type: true,
        sender: {
          select: {
            id: true,
            fullname: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
    }),

    prisma.notification.count({
      where: {
        receiverId: userId,
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};
//w: (end)  ╰──────────── getMyNotifications ────────────╯

//w: (start)╭──────────── markAllAsReadUnread ────────────╮
const markAllAsReadUnread = async (userId: string, isRead: boolean) => {
  await prisma.notification.updateMany({
    where: {
      receiverId: userId,
    },
    data: {
      isRead,
    },
  });
};
//w: (end)  ╰──────────── markAllAsReadUnread ────────────╯

export const NotificationService = {
  sendSingleNotification,
  getMyNotifications,
  markAllAsReadUnread,
};
