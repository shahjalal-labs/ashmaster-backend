import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ChecklistEndGoalsService } from "./checklistEndGoal.service";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { ChecklistEndGoalType } from "@prisma/client";

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
  const pickedPagination = pick(req.query, paginationOptions);

  const pickedFilter = pick(req.query, ["type"]);
  console.log(pickedPagination, "checklistEndGoal.controller.ts", 26);
  const { id } = req.user;
  const result = await ChecklistEndGoalsService.getMyChecklistOrEndGoals(
    id,
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
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── updateChecklistEndGoals ────────────╮
const updateChecklistEndGoals = catchAsync(async (req, res) => {
  const { id } = req.user;

  await ChecklistEndGoalsService.updateChecklistEndGoals(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Checklist updated successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── updateChecklistEndGoals ────────────╯

//w: (start)╭──────────── deleteChecklistEndGoals ────────────╮
const deleteChecklistEndGoals = catchAsync(async (req, res) => {
  const { id } = req.user;

  const checklistEndGoalsId = req.params.id;
  await ChecklistEndGoalsService.deleteChecklistEndGoals(
    id,
    checklistEndGoalsId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "End goals / checklist deleted successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── deleteChecklistEndGoals ────────────╯

export const ChecklistEndGoalsController = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
  updateChecklistEndGoals,
  deleteChecklistEndGoals,
};
