import { z } from "zod";

//w: (start)╭──────────── registration ────────────╮
const registrationSchema = z.object({
  fullname: z.string().min(2, "user name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
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
  fcmToken: z.string().optional(),
});
//w: (end)  ╰──────────── registration ────────────╯

//w: (start)╭──────────── verification ────────────╮
const verificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(4, "OTP must be at least 4 characters long"),
});
//w: (end)  ╰──────────── verification ────────────╯

export const userValidation = {
  registrationSchema,
  verificationSchema,
};
