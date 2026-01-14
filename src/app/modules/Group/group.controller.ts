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

const getGroupDetails = catchAsync(async (req, res) => {
  const groupId = req.params.id;
});

export const GroupController = {
  createGroup,
};
