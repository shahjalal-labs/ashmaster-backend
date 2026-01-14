import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { GroupService } from "./group.service";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = catchAsync(async (req, res) => {
  await GroupService.createGroup(req.user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Group successfully created.",
    data: null,
  });
});
//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── getGroupDetails ────────────╮
const getGroupDetails = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const group = await GroupService.getGroupDetails(groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group details fetched successfully.",
    data: group,
  });
});
//w: (end)  ╰──────────── getGroupDetails ────────────╯

const updateGroup = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  await GroupService.updateGroup(userId, groupId);
});

export const GroupController = {
  createGroup,
  getGroupDetails,
  updateGroup,
};
