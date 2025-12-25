import { Router } from "express";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import config, { ENV } from "../../../config";
import { ChecklistEndGoalsController } from "./checklistEndGoal.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ChecklistEndGoalsValidation } from "./checklistEndGoal.validation";

const router = Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.post(
  "/create",
  validateRequest(ChecklistEndGoalsValidation.createChecklistEndGoalsSchema),
  ChecklistEndGoalsController.createChecklistEndGoals,
);

export const ChecklistEndGoalsRoutes = router;
