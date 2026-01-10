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
  const userId = req.user.id;
  await NetworkService.sendConnectionRequest(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Connection request sent successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequests ────────────╮
const getPendingRequests = catchAsync(async (req, res) => {
  const id = req.user.id;
  const options = pick(req.query, paginationOptions);

  const result = await NetworkService.getPendingRequest(id, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending request fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getPendingRequests ────────────╯

//w: (start)╭──────────── getConnections ────────────╮
const getConnections = catchAsync(async (req, res) => {
  const id = req.user.id;
  const options = pick(req.query, paginationOptions);

  const result = await NetworkService.getConnections(id, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Connections fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getConnections ────────────╯

//w: (start)╭──────────── responseRequestOrRemoveConnection ────────────╮
const responseRequestOrRemoveConnection = catchAsync(async (req, res) => {
  const { id } = req.user;
  await NetworkService.responseRequestOrRemoveConnection(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request responsed successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── responseRequestOrRemoveConnection ────────────╯

//w: (start)╭──────────── getMyConnectionCount ────────────╮
const getMyConnectionCount = catchAsync(async (req, res) => {
  const { id: userId } = req.user;

  const result = await NetworkService.getMyConnectionCount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched connections count successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getMyConnectionCount ────────────╯

export const NetworkController = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  getConnections,
  responseRequestOrRemoveConnection,
  getMyConnectionCount,
};
