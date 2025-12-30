import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";

const router = Router();

router.use(auth());
// router.use(mentorGuard);

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

export const MentorProgressRoutes = router;
