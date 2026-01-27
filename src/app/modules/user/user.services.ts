import { PendingUser, User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import generateOTP from "../../../helpers/generateOtp";
import { Secret } from "jsonwebtoken";
import { redisOtpService } from "../../../shared/redis-services/otp.service";
import { emailQueue } from "../../../jobs/queues/emailQueue";

//w: (start)╭──────────── createUser ────────────╮
//create new user
const createUserIntoDB = async (payload: PendingUser) => {
  // ,,e,p,a,f(ipef)=> Email, Password, Fcm token, Fullname
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

  await emailQueue.add(
    "sendOtp",
    {
      email: payload.email,
      fullname: payload.fullname,
      otp,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: true,
    },
  );

  console.log(`job added`);
  // await sendEmail(userInfo.email, subject, html);
  await redisOtpService.storeOtp(userInfo.email, otp);
  return otp;
};
//w: (end)  ╰──────────── createUser ────────────╯

//verify user using otp for signup
//w: (start)╭──────────── signupVerification ────────────╮
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
        fcmToken: pendingUser.fcmToken ? [pendingUser.fcmToken] : [],
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
//w: (end)  ╰──────────── signupVerification ────────────╯

//w: (start)╭──────────── getUsers ────────────╮
//get all users
const getUsersIntoDB = async () => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      preference: true,
    },
  });
  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }
  const sanitizedUsers = users.map((user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  });
  return sanitizedUsers;
};
//w: (end)  ╰──────────── getUsers ────────────╯

export const userService = {
  createUserIntoDB,
  signupVerification,
  getUsersIntoDB,
};
