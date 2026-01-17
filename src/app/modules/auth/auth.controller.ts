import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

//login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User successfully logged in",
    data: result,
  });
});

//auth login google login
const authLogin = catchAsync(async (req, res) => {
  const result = await authService.authLogin(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User successfully authenticated",
    data: result,
  });
});

//send forgot password otp
//w: (start)╭──────────── sendForgotPasswordOtp ────────────╮
const sendForgotPasswordOtp = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.body.email as string;
    const response = await authService.sendForgotPasswordOtpDB(email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP send successfully",
      data: response,
    });
  },
);
//w: (end)  ╰──────────── sendForgotPasswordOtp ────────────╯

// verify forgot password otp code
//w: (start)╭──────────── verifyForgotPasswordOtpCode ────────────╮
const verifyForgotPasswordOtpCode = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await authService.verifyForgotPasswordOtpCodeDB(payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP verified successfully.",
      data: response,
    });
  },
);
//w: (end)  ╰──────────── verifyForgotPasswordOtpCode ────────────╯

// update forgot password
//w: (start)╭──────────── resetPassword ────────────╮
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { newPassword } = req.body;
  const result = await authService.resetForgotPasswordDB(newPassword, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password updated successfully.",
    data: result,
  });
});
//w: (end)  ╰──────────── resetPassword ────────────╯

// get profile for logged in user
//w: (start)╭──────────── getProfile ────────────╮
const getProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const user = await authService.getProfileFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});
//w: (end)  ╰──────────── getProfile ────────────╯

//w: (start)╭──────────── getOtherProfile ────────────╮
const getOtherProfile = catchAsync(async (req, res) => {
  const otherUserId = req.params.id as string;

  const userId = req.user.id;

  console.log({
    userId,
    otherUserId,
  });
  const result = await authService.getProfileFromDB(userId, otherUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getOtherProfile ────────────╯

//w: (start)╭──────────── updateProfile ────────────╮
const updateProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await authService.updateProfileIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── updateProfile ────────────╯

// update user profile only logged in user
//w: (start)╭──────────── updateProfileImage ────────────╮
const updateProfileImage = catchAsync(async (req: any, res: Response) => {
  const fileUrl = await authService.updateProfileImage(req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile image uploaded successfully",
    data: fileUrl,
  });
});
//w: (end)  ╰──────────── updateProfileImage ────────────╯

//w: (start)╭──────────── uploadFiles ────────────╮
const uploadFiles = catchAsync(async (req: any, res: Response) => {
  const fileUrl = await authService.uploadFiles(req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile image uploaded successfully",
    data: fileUrl,
  });
});
//w: (end)  ╰──────────── uploadFiles ────────────╯

//w: (start)╭──────────── completeProfile ────────────╮
const completeProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await authService.completeProfile(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Profile completed successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── completeProfile ────────────╯

//w: (start)╭──────────── deleteAccount ────────────╮
const deleteAccount = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await authService.deleteAccountFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account deleted successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── deleteAccount ────────────╯

export const authController = {
  loginUser,
  authLogin,
  getProfile,
  getOtherProfile,
  updateProfile,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtpCode,
  resetPassword,
  updateProfileImage,
  completeProfile,
  deleteAccount,
  uploadFiles,
};
