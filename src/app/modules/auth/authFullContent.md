# authFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/ashmaster_backend
├── bun.lock
├── msg.md
├── package.json
├── prisma
│   └── schema.prisma
├── README.md
├── src
│   ├── app
│   │   ├── interfaces
│   │   │   ├── common.ts
│   │   │   └── file.ts
│   │   ├── middlewares
│   │   │   ├── auth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── optionalAuth.ts
│   │   │   ├── parseBodyData.ts
│   │   │   ├── postman.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   └── user
│   │   │       ├── user.api.hurl
│   │   │       ├── user.controller.ts
│   │   │       ├── user.interface.ts
│   │   │       ├── user.route.ts
│   │   │       ├── user.services.ts
│   │   │       └── user.validation.ts
│   │   └── routes
│   │       └── index.ts
│   ├── app.ts
│   ├── config
│   │   ├── index.ts
│   │   ├── serviceAccount.ts
│   │   └── stripe.ts
│   ├── docs
│   │   └── cli_commands.md
│   ├── errors
│   │   ├── ApiErrors.ts
│   │   ├── handleClientError.ts
│   │   ├── handleValidationError.ts
│   │   ├── handleZodError.ts
│   │   └── parsePrismaValidationError.ts
│   ├── helpers
│   │   ├── fileUploader.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── generateOtp.ts
│   │   ├── jwtHelpers.ts
│   │   ├── onboardingHtml.ts
│   │   ├── sendEmail.ts
│   │   └── socket.service.ts
│   ├── interfaces
│   │   ├── common.ts
│   │   ├── error.ts
│   │   ├── file.ts
│   │   ├── index.d.ts
│   │   └── paginations.ts
│   ├── resource
│   │   ├── prompts
│   │   │   └── prompt.md
│   │   └── requirements.md
│   ├── server.ts
│   └── shared
│       ├── catchAsync.ts
│       ├── pagination.ts
│       ├── pick.ts
│       ├── prisma.ts
│       ├── redis-services
│       │   └── otp.service.ts
│       ├── redis.ts
│       ├── searchFilter.ts
│       ├── sendResponse.ts
│       ├── uploadInSpace.ts
│       └── userSearch.ts
├── structure.md
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

20 directories, 63 files
```

## 📁 auth Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/auth
├── auth.controller.ts
├── auth.routes.ts
├── auth.service.ts
└── auth.validation.ts

1 directory, 4 files
```

## 📋 schema.prisma

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

//w: (start)╭────────────  PendingUser  ────────────╮
model PendingUser {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  fullname  String
  fcmToken  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("Pending_users")
}

//w: (end)  ╰────────────  PendingUser  ────────────╯

//w: (start)╭────────────  User  ────────────╮
model User {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  email        String       @unique
  password     String?
  fullname     String
  fcmToken     String?
  role         UserRole     @default(MENTEE)
  profilStatus ProfilStatus @default(INCOMPLETE)
  profile      Profile?
  preference   Preference?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  @@map("users")
}

//w: (end)  ╰────────────  User  ────────────╯

//w: (start)╭────────────  Profile  ────────────╮
model Profile {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  about          String
  age            Int
  ethnicity      Ethnicity
  gender         Gender
  profession     String
  experienceYear String
  availability   Json
  profileImage   String?
  interests      String[]  @default([])
  userId         String    @unique @db.ObjectId
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@map("profiles")
}

//w: (end)  ╰──────────── Profile   ────────────╯

//w: (start)╭────────────  Preference  ────────────╮
model Preference {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  career    String
  gender    Gender
  ethnicity Ethnicity
  notes     String?
  age       AgeRange
  userId    String    @unique @db.ObjectId
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

//w: (end)  ╰──────────── Preference   ────────────╯

enum UserRole {
  MENTOR
  MENTEE
  ADMIN
}

enum Ethnicity {
  BLACK
  EAST_ASIAN
  HISPANIC
  MIDDLE_EASTERN
  NATIVE_AMERICAN
  PACIFIC_ISLANDER
  NO_ANSWER // prefer not to say
}

enum Gender {
  MALE
  FEMALE
  NO_ANSWER
}

enum ProfilStatus {
  COMPLETE
  INCOMPLETE
}

type AgeRange {
  min Int
  max Int
}
```

## 📦 package.json

```json
{
  "name": "hannanavtor-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "postinstall": "prisma generate"
  },
  "keywords": [],
  "author": "Ruhul Amin",
  "license": "ISC",
  "description": "hannanavtor-backend",
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.11",
    "@types/nodemailer": "^6.4.17",
    "@types/ws": "^8.18.1",
    "prisma": "^6.3.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.3"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.782.0",
    "@aws-sdk/lib-storage": "^3.782.0",
    "@prisma/client": "^6.3.0",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "agora-access-token": "^2.0.4",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "firebase-admin": "^13.2.0",
    "http-status": "^1.7.4",
    "ioredis": "^5.8.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.16",
    "nodemon": "^3.1.4",
    "stripe": "^18.0.0",
    "ws": "^8.18.1",
    "zod": "^3.23.8"
  }
}
```

## 🛠️ auth.service.ts

```ts
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Profile, User } from "@prisma/client";
import generateOTP from "../../../helpers/generateOtp";
import sendEmail from "../../../helpers/sendEmail";
import { uploadInSpace } from "../../../shared/uploadInSpace";
import { Secret } from "jsonwebtoken";
import { redisOtpService } from "../../../shared/redis-services/otp.service";
import httpStatus from "http-status";

//email, password login
//w: (start)╭──────────── loginUserIntoDB ────────────╮
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
  fcmToken: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password as string,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  await prisma.user.update({
    where: { email: user.email },
    data: {
      fcmToken: payload.fcmToken,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
  };
};
//w: (end)  ╰──────────── loginUserIntoDB ────────────╯

//w: (start)╭──────────── completeProfile ────────────╮
const completeProfile = async (userId: string, payload: Profile) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  await prisma.$transaction(async (tx) => {
    await tx.profile.create({
      where: {
        userId,
      },
      data: {
        ...payload,
      },
    });
  });
};
//w: (end)  ╰──────────── completeProfile ────────────╯

// google login
//w: (start)╭──────────── authLogin ────────────╮
const authLogin = async (payload: User) => {
  console.log(payload);
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (user) {
    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string,
    );

    await prisma.user.update({
      where: { email: user.email },
      data: {
        fcmToken: payload.fcmToken,
      },
    });

    return {
      accessToken,
    };
  } else {
    const user = await prisma.user.create({
      data: {
        ...payload,
      },
    });

    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string,
    );

    return {
      accessToken,
    };
  }
};
//w: (end)  ╰──────────── authLogin ────────────╯

//update or add user location
const userLocationUpdateInDB = async (
  userId: string,
  userLocation: UserLocation,
) => {
  const location = await prisma.userLocation.findFirst({
    where: { userId: userId },
  });
  if (!location) {
    const result = await prisma.userLocation.create({
      data: { ...userLocation, userId: userId },
    });

    return result;
  }

  const result = await prisma.userLocation.update({
    where: { id: location.id },
    data: userLocation,
  });

  return result;
};

//send forgot password otp
//w: (start)╭──────────── sendForgotPasswordOtpDB ────────────╮
const sendForgotPasswordOtpDB = async (email: string) => {
  const existringUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!existringUser) {
    throw new ApiError(404, "User not found");
  }
  // Generate OTP and expiry time
  const otp = generateOTP(); // 4-digit OTP
  const subject = "Your Password Reset OTP";
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Password Reset Request</h2>
    <p>Hi <b>${existringUser.fullname}</b>,</p>
    <p>Your OTP for password reset is:</p>
    <h1 style="color: #007BFF;">${otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
    <p>Thanks, <br>The Support Team</p>
  </div>
`;
  await sendEmail(email, subject, html);
  await redisOtpService.storeOtp(email, otp);

  return;
};
//w: (end)  ╰──────────── sendForgotPasswordOtpDB ────────────╯

// verify otp code
//w: (start)╭──────────── verifyForgotPasswordOtpCodeDB ────────────╮
const verifyForgotPasswordOtpCodeDB = async (payload: any) => {
  const { email, otp } = payload;

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user.id;

  await redisOtpService.verifyOtp(email, otp);

  const forgetToken = jwtHelpers.generateToken(
    { id: userId, email },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return { forgetToken };
};
//w: (end)  ╰──────────── verifyForgotPasswordOtpCodeDB ────────────╯

// reset password
//w: (start)╭──────────── resetForgotPasswordDB ────────────╮
const resetForgotPasswordDB = async (newPassword: string, userId: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }
  const email = existingUser.email as string;
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt),
  );

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};
//w: (end)  ╰──────────── resetForgotPasswordDB ────────────╯

//w: (start)╭──────────── getProfileFromDB ────────────╮
const getProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, createdAt, updatedAt, ...sanitizedUser } = user;

  return sanitizedUser;
};
//w: (end)  ╰──────────── getProfileFromDB ────────────╯

//w: (start)╭──────────── updateProfileIntoDB ────────────╮
const updateProfileIntoDB = async (userId: string, userData: User) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "user not found for edit user");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userData,
  });

  return updatedUser;
};
//w: (end)  ╰──────────── updateProfileIntoDB ────────────╯

//w: (start)╭──────────── updateProfileImage ────────────╮
const updateProfileImage = async (
  userId: string,
  file: Express.Multer.File,
) => {
  if (file === undefined) {
    throw new ApiError(400, "Please select an image");
  }
  const fileUrl = await uploadInSpace(file, "users/profileImage");
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImage: fileUrl,
    },
  });
  return;
};
//w: (end)  ╰──────────── updateProfileImage ────────────╯

export const authService = {
  loginUserIntoDB,
  authLogin,
  getProfileFromDB,
  updateProfileIntoDB,
  userLocationUpdateInDB,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCodeDB,
  resetForgotPasswordDB,
  updateProfileImage,
  completeProfile,
};
```

## 🔧 auth.routes.ts

```ts
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

router.put(
  "/profile",
  validateRequest(authValidation.updateProfileSchema),
  auth(),
  authController.updateProfile,
);
router.patch(
  "/profile-image",
  auth(),
  fileUploader.profileImage,
  authController.updateProfileImage,
);

export const AuthRoutes = router;
```

## 📝 auth.validation.ts

```ts
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
```

## 🎮 auth.controller.ts

```ts
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

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

//auth login
const authLogin = catchAsync(async (req, res) => {
  const result = await authService.authLogin(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User successfully authenticated",
    data: result,
  });
});

//update user location
const updateUserLocation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const updatedUser = await authService.userLocationUpdateInDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User location added successfully",
    data: updatedUser,
  });
});

//send forgot password otp
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

// update user profile only logged in user
const updateProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const updatedUser = await authService.updateProfileIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

// update user profile only logged in user
const updateProfileImage = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  await authService.updateProfileImage(id, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile image updated successfully",
  });
});

export const authController = {
  loginUser,
  authLogin,
  getProfile,
  updateProfile,
  updateUserLocation,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtpCode,
  resetPassword,
  updateProfileImage,
};
```

I need an api for complete profile it's task is complete profile with, profile data creation and preference creation, and change the user model complete profile status to complete. you need must strict zod validation with proper message.
and availability data pattern is like:

{
"monday": [
{"start": "09:00", "end": "12:00"},
{"start": "14:00", "end": "17:00"}
],
"tuesday": [
{"start": "10:00", "end": "15:00"}
],
// ... other days
}

here days mainly week days like saturday, sunday,, not all.

currently availability is only a json data in prisma, as json type is typescript friendly i prefer a new way without create a new model.
and must validate through zod so that front end can't send false validated data.
