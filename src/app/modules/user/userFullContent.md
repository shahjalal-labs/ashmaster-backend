## 🛠️ user.services.ts

```ts
import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import generateOTP from "../../../helpers/generateOtp";
import sendEmail from "../../../helpers/sendEmail";
import { Secret } from "jsonwebtoken";
import { redisOtpService } from "../../../shared/redis-services/otp.service";

//create new user
const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "email already exist!");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const userInfo = await prisma.pendingUser.upsert({
    where: { email: payload.email },
    update: {
      email: payload.email,
      fullname: payload.fullname,
      password: hashedPassword,
    },
    create: {
      email: payload.email,
      fullname: payload.fullname,
      password: hashedPassword,
      fcmToken: payload.fcmToken,
    },
  });

  // Generate OTP and expiry time
  const otp = generateOTP(); // 4-digit OTP
  const subject = "Signup Verification";
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>User Signup Verification</h2>
    <p>Hi <b>${userInfo.fullname}</b>,</p>
    <p>Your Signup Verification Code is:</p>
    <h1 style="color: #007BFF;">${otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
    <p>Thanks, <br>The Support Team</p>
  </div>
`;
  await sendEmail(userInfo.email, subject, html);
  await redisOtpService.storeOtp(userInfo.email, otp);
  return;
};

//verify user using otp for signup
const signupVerification = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  const existUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existUser) {
    throw new ApiError(404, "This Email Already Verified Using OTP");
  }

  const pendingUser = await prisma.pendingUser.findUnique({
    where: { email: email },
  });
  if (!pendingUser) {
    throw new ApiError(404, "Please first sign up");
  }

  const verifyData = await redisOtpService.verifyOtp(pendingUser.email, otp);

  if (!verifyData) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  const user = await prisma.$transaction(async (tx) => {
    await tx.pendingUser.delete({
      where: { email: email },
    });

    return tx.user.create({
      data: {
        fullname: pendingUser.fullname,
        email: pendingUser.email,
        password: pendingUser.password,
        fcmToken: pendingUser.fcmToken,
      },
    });
  });
  if (!user) {
    throw new ApiError(500, "Failed to create user");
  }

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
  };
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

//get all users
const getUsersIntoDB = async () => {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }
  const sanitizedUsers = users.map((user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  });
  return sanitizedUsers;
};

//update user
const updateUserIntoDB = async (id: string, userData: any) => {
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const existingUser = await getSingleUserIntoDB(id);
  if (!existingUser) {
    throw new ApiError(404, "user not found for edit user");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });

  const { password, ...sanitizedUser } = updatedUser;

  return sanitizedUser;
};

//delete user
const deleteUserIntoDB = async (userId: string, loggedId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  if (userId === loggedId) {
    throw new ApiError(403, "You can't delete your own account!");
  }
  const existingUser = await getSingleUserIntoDB(userId);
  if (!existingUser) {
    throw new ApiError(404, "user not found for delete this");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return;
};

export const userService = {
  createUserIntoDB,
  signupVerification,
  getUsersIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
```

## 🎮 user.controller.ts

```ts
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

//get users
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getUsersIntoDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users retrived successfully",
    data: users,
  });
});

//get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getSingleUserIntoDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user retrived successfully",
    data: user,
  });
});

//update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await userService.updateUserIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user updated successfully",
    data: updatedUser,
  });
});

//delete user
const deleteUser = catchAsync(async (req: any, res: Response) => {
  const userId = req.params.id;
  const loggedId = req.user.id;
  await userService.deleteUserIntoDB(userId, loggedId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user deleted successfully",
  });
});

export const userControllers = {
  createUser,
  signupVerification,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
```

## 🧪 user.api.hurl

```bash
# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Esha Rahman",
   "email":"esha@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"esha@merepost.com",
   "otp":"1446"
}
```

## 🔧 user.route.ts

```ts
import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  validateRequest(userValidation.registrationSchema),
  userControllers.createUser,
);
router.post(
  "/signup-verification",
  validateRequest(userValidation.verificationSchema),
  userControllers.signupVerification,
);
router.get("/", auth(UserRole.ADMIN), userControllers.getUsers);
router.get("/:id", auth(), userControllers.getSingleUser);
router.put("/:id", auth(UserRole.ADMIN), userControllers.updateUser);
router.delete("/:id", auth(), userControllers.deleteUser);

export const UserRoutes = router;
```

## 📝 user.validation.ts

```ts
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
```

## 📄 user.interface.ts

```ts
import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password: string;
  avatar?: string;
}

export interface IUpdateUser {
  firstName: string;
  lastName?: string;
  mobile?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}
```

this is an app for mentor and mentee connection, network. mentor and mentee will match through their preference given in the profile completion. And get suggestions and can connect each other.
guide me how can i implement, the mentee suggestion based on the preference he sets when logged in user is mentor, and similarly get mentor suggestion if logged in user is mentee. it will be must faster api response with proper pagination, and dynamic for mentee and mentor,and same api so front end can simply use it.

so now i am wanting the api for home page network suggestion. then i need to send network request, see pending network request, and accept reject api, try to keep less api with more function based on context or query, use proper similar pagination need faster response, use redis caching where necessary. keep the process simple, don't make it complex. try to flow the dry principle.
