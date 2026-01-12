import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import { GroupController } from "./group.controller";

const router = Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.post("/create", GroupController.createGroup);

export const GroupRoutes = router;
