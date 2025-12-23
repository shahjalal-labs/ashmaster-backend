import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";

// register user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Check your mailbox for verification process...",
    data: result,
  });
});

// signup verification
const signupVerification = catchAsync(async (req, res) => {
  const accessToken = await userService.signupVerification(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User signup verification successfully",
    data: accessToken,
  });
});

//w: (start)╭──────────── getUsers ────────────╮
//get users
const getUsers = catchAsync(async (req: Request, res: Response) => {
  console.log(`hitted`);
  const users = await userService.getUsersIntoDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users retrived successfully",
    data: users,
  });
});
//w: (end)  ╰──────────── getUsers ────────────╯

export const userControllers = {
  createUser,
  signupVerification,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
