import catchAsync from "../../../shared/catchAsync";
import { NotificationService } from "./notification.service";

const sendSingleNotification = catchAsync(async (req, res) => {
  const { receiverId, title, body, type, senderId, handlerId } = req.body;
  await NotificationService.sendSingleNotification(
    receiverId,
    title,
    body,
    type,
    senderId,
    handlerId,
  );
});

export const NotificationController = {
  sendSingleNotification,
};
