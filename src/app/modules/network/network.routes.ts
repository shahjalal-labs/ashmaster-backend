import express from "express";
import { NetworkController } from "./network.controller";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";

const router = express.Router();

// Get suggestions (for home page)
router.get(
  "/suggestions",
  auth(),
  profileGuard(),
  NetworkController.getSuggestions,
);

export const NetworkRoutes = router;
