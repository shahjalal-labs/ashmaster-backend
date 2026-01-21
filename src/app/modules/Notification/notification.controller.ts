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

export const NotificationController = {
  sendSingleNotification,
  getMyNotifications,
};
