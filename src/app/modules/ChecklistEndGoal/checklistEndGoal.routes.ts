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

router.get("/my", ChecklistEndGoalsController.getMyChecklistOrEndGoals);

router.get("/:id", ChecklistEndGoalsController.getAllChecklistOrEndGoals);

router.post(
  "/create",
  validateRequest(ChecklistEndGoalsValidation.createChecklistEndGoalsSchema),
  ChecklistEndGoalsController.createChecklistEndGoals,
);

router.patch(
  "/status",
  validateRequest(ChecklistEndGoalsValidation.updateChecklistEndGoalsSchema),
  ChecklistEndGoalsController.updateChecklistEndGoals,
);

router.delete("/:id", ChecklistEndGoalsController.deleteChecklistEndGoals);

router.get("/details/:id", ChecklistEndGoalsController.getChecklistEndGoalById);

export const ChecklistEndGoalsRoutes = router;
