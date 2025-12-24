import express from "express";
import { NetworkController } from "./network.controller";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";

const router = express.Router();

router.use(auth(), profileGuard());
// Get suggestions (for home page)
//w: (start)╭──────────── getSuggestions ────────────╮
router.get(
  "/suggestions",
  // auth(),
  // profileGuard(),
  NetworkController.getSuggestions,
);
//w: (end)  ╰──────────── getSuggestions ────────────╯

export const NetworkRoutes = router;
