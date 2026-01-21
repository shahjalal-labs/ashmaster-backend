import { Router } from "express";
import { NotificationController } from "./notification.controller";

const router = Router();

router.post("/send-test", NotificationController.sendSingleNotification);

export const NotificationRoutes = router;
