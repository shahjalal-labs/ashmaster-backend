import express from "express";
import { networkController } from "./network.controller";
import validateRequest from "../../middlewares/validateRequest";
import { networkValidation } from "./network.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

//w: (start)╭──────────── Network Routes ────────────╮

// Get suggestions (for home page)
router.get(
  "/suggestions",
  auth(),
  validateRequest(networkValidation.recommendationsQuerySchema, "query"),
  networkController.getSuggestions,
);

// Send connection request
router.post(
  "/request",
  auth(),
  validateRequest(networkValidation.sendRequestSchema),
  networkController.sendConnectionRequest,
);

// Get pending requests (sent and received)
router.get(
  "/requests/pending",
  auth(),
  validateRequest(networkValidation.paginationSchema, "query"),
  networkController.getPendingRequests,
);

// Accept/reject connection request
router.patch(
  "/request/status",
  auth(),
  validateRequest(networkValidation.updateRequestStatusSchema),
  networkController.updateRequestStatus,
);

// Get all connections
router.get(
  "/connections",
  auth(),
  validateRequest(networkValidation.paginationSchema, "query"),
  networkController.getConnections,
);

// Remove connection
router.delete(
  "/connection/:connectionId",
  auth(),
  networkController.removeConnection,
);

// Get network stats
router.get("/stats", auth(), networkController.getNetworkStats);

//w: (end)  ╰──────────── Network Routes ────────────╯

export const NetworkRoutes = router;
