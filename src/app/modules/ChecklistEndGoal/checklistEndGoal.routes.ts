import { Router } from "express";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";

const router = Router();

router.use(auth(), profileGuard());
