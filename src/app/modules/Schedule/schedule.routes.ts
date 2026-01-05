import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleController } from "./schedule.controller";
import { ScheduleValidation } from "./schedule.validation";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";

const router = express.Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

//w: (start)╭──────────── createSchedule ────────────╮
router.post(
  "/create",
  validateRequest(ScheduleValidation.createScheduleSchema),
  ScheduleController.createSchedule,
);
//w: (end)  ╰──────────── createSchedule ────────────╯

router.get("/", ScheduleController.mySchedule);

router.get(
  "/current-month-schedules",
  ScheduleController.getCurrentMonthSchedules,
);

export const ScheduleRoutes = router;
