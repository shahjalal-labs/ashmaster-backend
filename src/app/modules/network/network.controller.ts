import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";
import { NetworkService } from "./network.service";

// Get network suggestions
//w: (start)╭──────────── getSuggestions ────────────╮
const getSuggestions = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const options = pick(req.query, paginationOptions);

  const result = await NetworkService.getSuggestions(id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestions retrieved successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── sendConnectionRequest ────────────╮
const sendConnectionRequest = catchAsync(async (req, res) => {
  await NetworkService.sendConnectionRequest("", req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Connection request sent successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

export const NetworkController = {
  getSuggestions,
  sendConnectionRequest,
};
