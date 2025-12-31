import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import { MentorProgressController } from "./mentorProgress.controller";

const router = Router();

router.use(auth());
// router.use(mentorGuard);

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.get("/checklist-view", MentorProgressController.mentorChecklistView);

router.get("/:id", MentorProgressController.viewSpeficMenteeChecklists);

export const MentorProgressRoutes = router;
