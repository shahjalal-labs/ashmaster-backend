import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import { GroupController } from "./group.controller";
import validateRequest from "../../middlewares/validateRequest";
import { GroupValidation } from "./group.validation";

const router = Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.post(
  "/create",
  validateRequest(GroupValidation.createGroupSchema),
  GroupController.createGroup,
);

router.get("/:id", GroupController.getGroupDetails);

router.patch(
  "/:id",
  validateRequest(GroupValidation.updateGroupSchema),
  GroupController.updateGroup,
);

//  /members/groupId
router.get("/members/:id", GroupController.fetchAllMembers);

// /groupId/leave
router.delete("/:id/leave", GroupController.leaveGroup);

// /groupId/find-members
router.get("/:id/find-members", GroupController.findMembersToAdd);

export const GroupRoutes = router;
