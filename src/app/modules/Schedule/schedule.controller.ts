import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { pick } from "../../../shared/pick";
import {
  paginationHelper,
  paginationOptions,
} from "../../../shared/paginationHelper";

//w: (start)╭──────────── createSchedule ────────────╮
const createSchedule = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await ScheduleService.createSchedule(userId, req.body);
  console.log(result, "schedule.controller.ts", 7);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully.",
  });
});
//w: (end)  ╰──────────── createSchedule ────────────╯

//w: (start)╭──────────── mySchedule ────────────╮
const mySchedule = catchAsync(async (req, res) => {
  const { id: userId } = req.user;

  const pickedPaginate = pick(req.query, paginationOptions);

  const result = await ScheduleService.mySchedule(userId, pickedPaginate);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched my schedules",
    data: result,
  });
});
//w: (end)  ╰──────────── mySchedule ────────────╯

//w: (start)╭──────────── getScheduleDetails ────────────╮
const getScheduleDetails = catchAsync(async (req, res) => {
  const { id: scheduleId } = req.params;
  const schedule = await ScheduleService.getScheduleDetails(scheduleId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule details fetched successfully",
    data: schedule,
  });
});
//w: (end)  ╰──────────── getScheduleDetails ────────────╯

//w: (start)╭──────────── getCurrentMonthSchedules ────────────╮
const getCurrentMonthSchedules = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await ScheduleService.getCurrentMonthSchedules(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched current months schedules",
    data: result,
  });
});
//w: (end)  ╰──────────── getCurrentMonthSchedules ────────────╯

export const ScheduleController = {
  createSchedule,
  mySchedule,
  getCurrentMonthSchedules,
  getScheduleDetails,
};
