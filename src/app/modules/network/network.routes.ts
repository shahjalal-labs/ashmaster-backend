import express from "express";
import { NetworkController } from "./network.controller";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import validateRequest from "../../middlewares/validateRequest";
import { NetworkValidation } from "./network.validation";
import config, { ENV } from "../../../config";

const router = express.Router();

router.use(auth());
/* if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
} */
// Get suggestions (for home page)
//w: (start)╭──────────── getSuggestions ────────────╮
router.get("/suggestions", NetworkController.getSuggestions);
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── exploreAllUsers ────────────╮
router.get("/explore-all", NetworkController.exploreAllUsers);
//w: (end)  ╰──────────── exploreAllUsers ────────────╯

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

router.patch(
  "/response-or-remove",
  validateRequest(NetworkValidation.responseRequestOrRemoveConnection),
  NetworkController.responseRequestOrRemoveConnection,
);

//w: (start)╭──────────── respondToUser ────────────╮
router.patch(
  "/respond-to-user",
  validateRequest(NetworkValidation.respondRequestByOtherUserId),
  NetworkController.respondRequestByOtherUserId,
);
//w: (end)  ╰──────────── respondToUser ────────────╯

router.get("/connections-count", NetworkController.getMyConnectionCount);

export const NetworkRoutes = router;
