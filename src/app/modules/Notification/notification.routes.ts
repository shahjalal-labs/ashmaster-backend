import { Router } from "express";
import { NotificationController } from "./notification.controller";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/send-test", NotificationController.sendSingleNotification);

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.get("/my", auth(), NotificationController.getMyNotifications);

export const NotificationRoutes = router;
