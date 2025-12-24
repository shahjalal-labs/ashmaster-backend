import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { networkService } from "./network.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

// Get network suggestions
const getSuggestions = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const options = pick(req.query, paginationOptions);

  const result = await networkService.getSuggestions(id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestions retrieved successfully",
    data: result,
  });
});

// Send connection request
const sendConnectionRequest = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await networkService.sendConnectionRequest(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Connection request sent successfully",
    data: result,
  });
});

// Get pending requests
const getPendingRequests = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const result = await networkService.getPendingRequests(id, {
    page: Number(page),
    limit: Number(limit),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending requests retrieved successfully",
    data: result,
  });
});

// Accept/reject connection request
const updateRequestStatus = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await networkService.updateRequestStatus(id, req.body);

  const message =
    req.body.status === "ACCEPTED"
      ? "Connection request accepted"
      : "Connection request rejected";

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    data: result,
  });
});

// Get all connections
const getConnections = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const result = await networkService.getConnections(id, {
    page: Number(page),
    limit: Number(limit),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Connections retrieved successfully",
    data: result,
  });
});

// Remove connection
const removeConnection = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { connectionId } = req.params;

  const result = await networkService.removeConnection(id, connectionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Connection removed successfully",
    data: result,
  });
});

// Get network stats
const getNetworkStats = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await networkService.getNetworkStats(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Network stats retrieved successfully",
    data: result,
  });
});

export const networkController = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  updateRequestStatus,
  getConnections,
  removeConnection,
  getNetworkStats,
};
