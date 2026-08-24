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

//w: (start)╭──────────── exploreAllUsers ────────────╮
const exploreAllUsers = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;

  // Pick pagination fields and additional filters
  const options = {
    ...pick(req.query, paginationOptions),
    role: req.query.role,
    search: req.query.search,
  };

  const result = await NetworkService.exploreAllUsers(id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Explore users fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── exploreAllUsers ────────────╯

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

//w: (start)╭──────────── respondToUser ────────────╮
const respondRequestByOtherUserId = catchAsync(
  async (req: any, res: Response) => {
    const { id: userId } = req.user;
    const { targetUserId, action } = req.body;

    const result = await NetworkService.respondRequestByOtherUserId(userId, {
      targetUserId,
      action,
    });

    const messageMap: any = {
      ACCEPT: "Connection request accepted successfully",
      REJECT: "Connection request rejected successfully",
      REMOVE: "Connection removed successfully",
    };

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: messageMap[action] || "Action completed successfully",
      data: result,
    });
  },
);
//w: (end)  ╰──────────── respondToUser ────────────╯

//w: (start)╭──────────── getMyConnectionCount ────────────╮
const getMyConnectionCount = catchAsync(async (req, res) => {
  const { id: userId } = req.user;

  const result = await NetworkService.getMyConnectionCount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched my connections count successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getMyConnectionCount ────────────╯

export const NetworkController = {
  getSuggestions,
  exploreAllUsers,
  sendConnectionRequest,
  getPendingRequests,
  getConnections,
  responseRequestOrRemoveConnection,
  respondRequestByOtherUserId,
  getMyConnectionCount,
};
