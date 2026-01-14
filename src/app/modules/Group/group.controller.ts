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

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroup = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  await GroupService.updateGroup(userId, groupId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group updated successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── updateGroup ────────────╯

//w: (start)╭──────────── fetchAllMembers ────────────╮
const fetchAllMembers = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  const result = await GroupService.fetchAllMembers(userId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched all members successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── fetchAllMembers ────────────╯

export const GroupController = {
  createGroup,
  getGroupDetails,
  updateGroup,
  fetchAllMembers,
};
