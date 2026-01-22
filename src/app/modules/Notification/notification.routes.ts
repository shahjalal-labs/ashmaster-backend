import { Router } from "express";
import { NotificationController } from "./notification.controller";
import config, { ENV } from "../../../config";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/send-test", NotificationController.sendSingleNotification);

if (config.env === ENV.DEVELOPMENT) {
  // router.use(profileGuard());
}

router.use(auth());

router.get("/my", NotificationController.getMyNotifications);

//mark all as read or unread
router.patch("/mark-all", NotificationController.markAllAsReadUnread);

export const NotificationRoutes = router;
