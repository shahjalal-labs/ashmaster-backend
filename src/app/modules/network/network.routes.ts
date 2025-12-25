import express from "express";
import { NetworkController } from "./network.controller";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import validateRequest from "../../middlewares/validateRequest";
import { NetworkValidation } from "./network.validation";

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

//w: (start)╭──────────── sendConnectionRequest ────────────╮
router.post(
  "/request",
  validateRequest(NetworkValidation.sendConnectionRequest),
  NetworkController.sendConnectionRequest,
);
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequests ────────────╮
router.get("/request-pending", NetworkController.getPendingRequests);

router.get("/connections", NetworkController.getConnections);

router.patch("/request/response", NetworkController.responseRequest);

export const NetworkRoutes = router;
