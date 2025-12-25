import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ChecklistEndGoalsService } from "./checklistEndGoal.service";

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

export const ChecklistEndGoalsController = {
  createChecklistEndGoals,
};
