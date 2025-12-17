import { Ethnicity, Gender, UserRole } from "@prisma/client";
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
    fcmToken: z.string().optional(),
    fullname: z.string(),
  })
  .strict()
  .strict();
//w: (end)  ╰──────────── authLogin ────────────╯

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

// Define days of the week
const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

// Time slot validation
const timeSlotSchema = z
  .object({
    start: z.string().regex(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
      message: "Start time must be in HH:MM format (24-hour)",
    }),
    end: z.string().regex(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
      message: "End time must be in HH:MM format (24-hour)",
    }),
  })
  .refine(
    (data) => {
      const start = parseInt(data.start.replace(":", ""));
      const end = parseInt(data.end.replace(":", ""));
      return start < end;
    },
    {
      message: "End time must be after start time",
      path: ["end"],
    },
  );

// Availability validation
const availabilitySchema = z
  .object({
    monday: z.array(timeSlotSchema).optional().default([]),
    tuesday: z.array(timeSlotSchema).optional().default([]),
    wednesday: z.array(timeSlotSchema).optional().default([]),
    thursday: z.array(timeSlotSchema).optional().default([]),
    friday: z.array(timeSlotSchema).optional().default([]),
    saturday: z.array(timeSlotSchema).optional().default([]),
    sunday: z.array(timeSlotSchema).optional().default([]),
  })
  .strict()
  .refine(
    (data) => {
      // At least one day should have availability
      return Object.values(data).some((slots) => slots && slots.length > 0);
    },
    {
      message: "At least one day must have time slots",
    },
  );

// Age range validation
const ageRangeSchema = z
  .object({
    min: z
      .number()
      .int()
      .min(18, "Minimum age must be at least 18")
      .max(100, "Minimum age must be at most 100"),
    max: z
      .number()
      .int()
      .min(18, "Maximum age must be at least 18")
      .max(100, "Maximum age must be at most 100"),
  })
  .refine((data) => data.min <= data.max, {
    message: "Minimum age must be less than or equal to maximum age",
    path: ["max"],
  });

//w: (start)╭──────────── completeProfileSchema ────────────╮
const completeProfileSchema = z
  .object({
    // Profile data
    profile: z.object({
      about: z
        .string()
        .min(10, "About must be at least 10 characters long")
        .max(500, "About must be at most 500 characters long"),
      age: z
        .number()
        .int()
        .min(18, "Age must be at least 18")
        .max(100, "Age must be at most 100"),
      ethnicity: z.nativeEnum(Ethnicity, {
        errorMap: () => ({ message: "Invalid ethnicity value" }),
      }),
      gender: z.nativeEnum(Gender, {
        errorMap: () => ({ message: "Invalid gender value" }),
      }),
      profession: z
        .string()
        .min(2, "Profession must be at least 2 characters long")
        .max(100, "Profession must be at most 100 characters long"),
      experienceYear: z
        .number()
        .positive()
        .max(50, "Experience year must be at most 50 characters long"),
      availability: availabilitySchema,
      profileImage: z
        .string()
        .url("Profile image must be a valid URL")
        .optional(),
      interests: z
        .array(
          z
            .string()
            .min(2, "Interest must be at least 2 characters long")
            .max(50, "Interest must be at most 50 characters long"),
        )
        .min(1, "At least one interest is required")
        .max(10, "Maximum 10 interests allowed"),
    }),

    // Preference data
    preference: z.object({
      career: z
        .string()
        .min(2, "Career preference must be at least 2 characters long")
        .max(100, "Career preference must be at most 100 characters long"),
      gender: z.nativeEnum(Gender, {
        errorMap: () => ({ message: "Invalid preferred gender value" }),
      }),
      ethnicity: z.nativeEnum(Ethnicity, {
        errorMap: () => ({ message: "Invalid preferred ethnicity value" }),
      }),
      notes: z
        .string()
        .max(500, "Notes must be at most 500 characters long")
        .optional(),
      age: ageRangeSchema,
    }),

    // User role (optional, defaults to current role)
    role: z
      .nativeEnum(UserRole, {
        errorMap: () => ({ message: "Invalid role value" }),
      })
      .optional(),
  })
  .strict();
//w: (end)  ╰──────────── completeProfileSchema ────────────╯

//w: (start)╭──────────── updateProfileSchema ────────────╮
// Create partial versions of complete schemas for update
const partialProfileSchema = completeProfileSchema.shape.profile.partial();
const partialPreferenceSchema =
  completeProfileSchema.shape.preference.partial();

// Update profile schema (all fields optional except structure)
const updateProfileSchema = z
  .object({
    // User fields that can be updated (from existing user model)
    fullname: z
      .string()
      .min(2, "Full name must be at least 2 characters long")
      .max(101, "Full name must be at most 100 characters long")
      .optional(),
    fcmToken: z.string().optional(),
    role: z
      .nativeEnum(UserRole, {
        errorMap: () => ({ message: "Invalid role value" }),
      })
      .optional(),

    // Profile fields (all optional, using partial schema)
    profile: partialProfileSchema.optional(),

    // Preference fields (all optional, using partial schema)
    preference: partialPreferenceSchema.optional(),
  })
  .strict()
  .refine(
    (data) => {
      // At least one field should be provided for update
      const hasUserFields = data.fullname || data.fcmToken || data.role;
      const hasProfileFields =
        data.profile && Object.keys(data.profile).length > 0;
      const hasPreferenceFields =
        data.preference && Object.keys(data.preference).length > 0;

      return hasUserFields || hasProfileFields || hasPreferenceFields;
    },
    {
      message: "At least one field must be provided for update",
    },
  );
//w: (end)  ╰──────────── updateProfileSchema ────────────╯

// Generate TypeScript types from the schemas
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>; // Generate TypeScript type from the schema

export const authValidation = {
  updateProfileSchema,
  authLoginSchema,
  sendForgotPassOtp,
  loginSchema,
  verifyForgotPasswordOtpCodeDB,
  resetPasswordSchema,
  completeProfileSchema,
};
