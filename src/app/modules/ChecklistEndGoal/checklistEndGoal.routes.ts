import { Router } from "express";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import config, { ENV } from "../../../config";

const router = Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}
