import { Router } from "express";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import config, { ENV } from "../../../config";
import { MentorProgressController } from "./mentorProgress.controller";
// import mentorGuard from "../../middlewares/mentorGuard";

const router = Router();

router.use(auth());
// router.use(mentorGuard);

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

// Get mentor's progress summary
router.get("/", MentorProgressController.getMentorProgress);

// Mark a mentee as viewed
router.post(
  "/mentees/:menteeId/view",
  MentorProgressController.markMenteeAsViewed,
);

// Get specific mentee's checklists (this will also mark as viewed)
router.get(
  "/mentees/:menteeId/checklists",
  MentorProgressController.getMenteeDetailsWithChecklists,
);

// Get count of unviewed mentees (for badge/notification)
router.get("/unviewed-count", MentorProgressController.getUnviewedMenteesCount);

export const MentorProgressRoutes = router;
