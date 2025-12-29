import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MentorProgressService } from "./mentorProgress.service";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── getMentorProgress ────────────╮
const getMentorProgress = catchAsync(async (req, res) => {
  const { id: mentorId } = req.user;
  const result = await MentorProgressService.getMentorProgress(mentorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mentor progress fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getMentorProgress ────────────╯

//w: (start)╭──────────── markMenteeAsViewed ────────────╮
const markMenteeAsViewed = catchAsync(async (req, res) => {
  const { id: mentorId } = req.user;
  const { menteeId } = req.params;

  await MentorProgressService.markMenteeAsViewed(mentorId, menteeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mentee marked as viewed successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── markMenteeAsViewed ────────────╯

//w: (start)╭──────────── getMenteeChecklists ────────────╮
const getMenteeChecklists = catchAsync(async (req, res) => {
  const { id: mentorId } = req.user;
  const { menteeId } = req.params;
  const pickedPagination = pick(req.query, paginationOptions);
  const pickedFilter = pick(req.query, ["type"]);

  const result = await MentorProgressService.getMenteeChecklists(
    mentorId,
    menteeId,
    pickedPagination,
    pickedFilter,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mentee checklists fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getMenteeChecklists ────────────╯

//w: (start)╭──────────── getUnviewedMenteesCount ────────────╮
const getUnviewedMenteesCount = catchAsync(async (req, res) => {
  const { id: mentorId } = req.user;

  const count = await MentorProgressService.getUnviewedMenteesCount(mentorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unviewed mentees count fetched successfully",
    data: { count },
  });
});
//w: (end)  ╰──────────── getUnviewedMenteesCount ────────────╯

export const MentorProgressController = {
  getMentorProgress,
  markMenteeAsViewed,
  getMenteeChecklists,
  getUnviewedMenteesCount,
};
