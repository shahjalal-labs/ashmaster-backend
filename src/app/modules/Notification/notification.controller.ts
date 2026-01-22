import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NotificationService } from "./notification.service";

//w: (start)╭──────────── sendSingleNotification ────────────╮
//send test notification
const sendSingleNotification = catchAsync(async (req, res) => {
  const {
    receiverId,
    title,
    body,
    type,
    senderId,
    handlerId,
    notificationChannel,
  } = req.body;

  await NotificationService.sendSingleNotification(
    receiverId,
    title,
    body,
    type,
    notificationChannel,
    senderId,
    handlerId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Test notification send successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── sendSingleNotification ────────────╯

//w: (start)╭──────────── getMyNotifications ────────────╮
const getMyNotifications = catchAsync(async (req, res) => {
  const { id: userId } = req.user;

  const result = await NotificationService.getMyNotifications(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched my notifications successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getMyNotifications ────────────╯

//w: (start)╭──────────── markAllAsReadUnread ────────────╮
const markAllAsReadUnread = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { isRead } = req.body;

  const result = await NotificationService.markAllAsReadUnread(userId, isRead);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status change successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── markAllAsReadUnread ────────────╯

export const NotificationController = {
  sendSingleNotification,
  getMyNotifications,
  markAllAsReadUnread,
};
