import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

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

  const result = "";

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched my schedules",
    data: result,
  });
});
//w: (end)  ╰──────────── mySchedule ────────────╯

export const ScheduleController = {
  createSchedule,
  mySchedule,
};
