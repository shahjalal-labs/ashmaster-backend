import express from "express";
import { networkController } from "./network.controller";
import validateRequest from "../../middlewares/validateRequest";
import { networkValidation } from "./network.validation";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";

const router = express.Router();

//w: (start)╭──────────── Network Routes ────────────╮

// Get suggestions (for home page)
router.get(
  "/suggestions",
  auth(),
  profileGuard(),
  networkController.getSuggestions,
);

export const NetworkRoutes = router;
