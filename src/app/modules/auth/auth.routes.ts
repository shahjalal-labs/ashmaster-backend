import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

//email pass login
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.loginUser,
);

//google login
router.post(
  "/auth-login",
  validateRequest(authValidation.authLoginSchema),
  authController.authLogin,
);
router.get("/profile", auth(), authController.getProfile);

router.patch(
  "/update/user-location",
  auth(),
  authController.updateUserLocation,
);

//w: (start)╭──────────── sendForgotPassOtp ────────────╮
router.post(
  "/send-forgot-otp",
  validateRequest(authValidation.sendForgotPassOtp),
  authController.sendForgotPasswordOtp,
);
//w: (end)  ╰──────────── sendForgotPassOtp ────────────╯

router.post(
  "/verify-forgot-otp",
  validateRequest(authValidation.verifyForgotPasswordOtpCodeDB),
  authController.verifyForgotPasswordOtpCode,
);

router.patch(
  "/reset-password",
  auth(),
  validateRequest(authValidation.resetPasswordSchema),
  authController.resetPassword,
);

//w: (start)╭──────────── router ────────────╮
router.patch(
  "/profile-image",
  auth(),
  fileUploader.profileImage,
  authController.updateProfileImage,
);
//w: (end)  ╰──────────── router ────────────╯

//w: (start)╭──────────── completeProfile ────────────╮
router.post(
  "/complete-profile",
  auth(),
  validateRequest(authValidation.completeProfileSchema),
  authController.completeProfile,
);
//w: (end)  ╰──────────── completeProfile ────────────╯

// Update user profile (replaces the old route)
router.put(
  "/profile",
  auth(),
  validateRequest(authValidation.updateProfileSchema),
  authController.updateProfile,
);

//
//
//w: (start)╭──────────── deleteAccount ────────────╮
router.delete("/delete-account", auth(), authController.deleteAccount);
//w: (end)  ╰──────────── deleteAccount ────────────╯

export const AuthRoutes = router;
