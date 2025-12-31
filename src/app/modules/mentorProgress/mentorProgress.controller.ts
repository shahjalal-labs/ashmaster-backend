import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MentorProgressService } from "./mentorProgress.service";
import { paginationOptions } from "../../../shared/paginationHelper";
import { pick } from "../../../shared/pick";

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

//w: (start)╭──────────── viewSpeficMenteeChecklists ────────────╮
const viewSpeficMenteeChecklists = catchAsync(async (req, res) => {
  const pickedPagination = pick(req.query, paginationOptions);

  const pickedFilter = pick(req.query, ["type"]);
  const { id: menteeId } = req.params;
  const { id: userId } = req.user;
  const result = await MentorProgressService.viewSpeficMenteeChecklists(
    userId,
    menteeId,
    pickedPagination,
    pickedFilter,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ` fetched successfully`,
    data: result,
  });
});
//w: (end)  ╰──────────── viewSpeficMenteeChecklists ────────────╯

export const MentorProgressController = {
  mentorChecklistView,
  viewSpeficMenteeChecklists,
};
