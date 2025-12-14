import { z } from "zod";

//w: (start)╭──────────── login ────────────╮
// email pass login
const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    fcmToken: z.string().optional(),
  })
  .strict();
//w: (end)  ╰──────────── login ────────────╯

//w: (start)╭──────────── authLogin ────────────╮
// google login
const authLoginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    fcmToken: z.string().min(1, "FCM Token is required!").optional(),
    fullname: z.string(),
  })
  .strict()
  .strict();
//w: (end)  ╰──────────── authLogin ────────────╯

//w: (start)╭──────────── updateProfile ────────────╮
const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .optional(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .optional(),
    mobile: z
      .string()
      .min(10, "Mobile must be at least 10 characters long")
      .optional(),
  })
  .strict();
//w: (end)  ╰──────────── updateProfile ────────────╯

//w: (start)╭──────────── sendForgotPassOtp ────────────╮
const sendForgotPassOtp = z
  .object({
    email: z.string().email(),
  })
  .strict();
//w: (end)  ╰──────────── sendForgotPassOtp ────────────╯

//w: (start)╭──────────── verifyForgotPasswordOtpCodeDB ────────────╮
const verifyForgotPasswordOtpCodeDB = z
  .object({
    email: z.string().email(),
    otp: z.string(),
  })
  .strict();
//w: (end)  ╰──────────── verifyForgotPasswordOtpCodeDB ────────────╯

//w: (start)╭──────────── resetPassword ────────────╮
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must be at most 64 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#^()_\-+=\[\]{};:'",.<>\/\\|]/,
        "Password must contain at least one special character",
      )
      .regex(/^\S+$/, "Password must not contain spaces"),
  })
  .strict();
//w: (end)  ╰──────────── resetPassword ────────────╯

export const authValidation = {
  updateProfileSchema,
  authLoginSchema,
  sendForgotPassOtp,
  loginSchema,
  verifyForgotPasswordOtpCodeDB,
  resetPasswordSchema,
};
