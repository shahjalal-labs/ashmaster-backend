import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ChecklistEndGoalsService } from "./checklistEndGoal.service";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoals = catchAsync(async (req, res) => {
  const { id } = req.user;
  await ChecklistEndGoalsService.createChecklistEndGoals(id, req.body);

  const { type } = req.body;
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${type} created successfully`,
    data: null,
  });
});
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── getMyChecklistOrEndGoals ────────────╮
const getMyChecklistOrEndGoals = catchAsync(async (req, res) => {
  const picked = pick(req.query, ["type", ...paginationOptions]);
  console.log(picked, "checklistEndGoal.controller.ts", 26);
  const { id } = req.user;
  const result = await ChecklistEndGoalsService.getMyChecklistOrEndGoals(
    id,
    picked,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ` fetched successfully`,
    data: result,
  });
});
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

export const ChecklistEndGoalsController = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
};
