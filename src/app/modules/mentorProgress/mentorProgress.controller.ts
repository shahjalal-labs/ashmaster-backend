import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MentorProgressService } from "./mentorProgress.service";

//w: (start)╭──────────── mentorChecklistView ────────────╮
const mentorChecklistView = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await MentorProgressService.mentorChecklistView(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched Successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── mentorChecklistView ────────────╯

export const MentorProgressController = {
  mentorChecklistView,
};
