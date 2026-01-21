import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { ProfilStatus, User } from "@prisma/client";
import generateOTP from "../../../helpers/generateOtp";
import { uploadInSpace } from "../../../shared/uploadInSpace";
import { Secret } from "jsonwebtoken";
import { redisOtpService } from "../../../shared/redis-services/otp.service";
import httpStatus from "http-status";
import {
  TAuthLogin,
  TCompleteProfileInput,
  UpdateProfileInput,
} from "./auth.validation";
import redisClient from "../../../shared/redis";
import { emailQueue } from "../../../jobs/queues/emailQueue";
import { notificationQueue } from "../../../jobs/queues/notificationQueue";

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

  const fcmTokens = user.fcmToken;
  fcmTokens.push(payload.fcmToken);

  await prisma.user.update({
    where: { email: user.email },
    data: {
      fcmToken: fcmTokens,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    profileStatus: user.profilStatus,
    id: user.id,
    role: user.role,
  };
};
//w: (end)  ╰──────────── loginUserIntoDB ────────────╯

// google login
//w: (start)╭──────────── authLogin ────────────╮
const authLogin = async (payload: TAuthLogin) => {
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

    const fcmTokens = user.fcmToken;

    if (payload.fcmToken) {
      fcmTokens.push(payload.fcmToken);
    }
    await prisma.user.update({
      where: { email: user.email },
      data: {
        fcmToken: fcmTokens,
      },
    });

    return {
      accessToken,
      profileStatus: user.profilStatus,
      id: user.id,
      role: user.role,
    };
  } else {
    const user = await prisma.user.create({
      data: {
        ...payload,
        fcmToken: payload.fcmToken ? [payload.fcmToken] : [],
      },
    });

    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string,
    );

    return {
      accessToken,
      profileStatus: ProfilStatus.INCOMPLETE,
      id: user.id,
    };
  }
};
//w: (end)  ╰──────────── authLogin ────────────╯

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
  await emailQueue.add("forgotPasswordOtp", {
    email,
    otp,
  });

  // await sendEmail(email, subject, html);
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

// Cache keys
const CACHE_PREFIX = "user:profile:";
const CACHE_TTL = 3600; // 1 hour in seconds

// Helper function to get cache key
const getProfileCacheKey = (userId: string): string => {
  return `${CACHE_PREFIX}${userId}`;
};

// Helper function to clear profile cache
const clearProfileCache = async (userId: string): Promise<void> => {
  try {
    await redisClient.del(getProfileCacheKey(userId));
    console.log(`Cleared cache for user: ${userId}`);
  } catch (error) {
    console.error("Failed to clear profile cache:", error);
    // Don't throw error, just log it - cache clearing failure shouldn't break the main flow
  }
};

// Helper function to set profile cache
const setProfileCache = async (userId: string, data: any): Promise<void> => {
  try {
    await redisClient.setex(
      getProfileCacheKey(userId),
      CACHE_TTL,
      JSON.stringify(data),
    );
    console.log(`Cached profile for user: ${userId}`);
  } catch (error) {
    console.error("Failed to cache profile:", error);
    // Don't throw error, just log it - cache failure shouldn't break the main flow
  }
};

//w: (start)╭──────────── getProfile ────────────╮
// Helper function to get profile from cache
const getProfileFromCache = async (userId: string): Promise<any | null> => {
  try {
    const cachedData = await redisClient.get(getProfileCacheKey(userId));
    if (cachedData) {
      console.log(`Cache hit for user: ${userId}`);
      return JSON.parse(cachedData);
    }
    console.log(`Cache miss for user: ${userId}`);
    return null;
  } catch (error) {
    console.error("Failed to get profile from cache:", error);
    return null;
  }
};

const getProfileFromDB = async (userId: string, otherUserId?: string) => {
  // Try to get from cache first
  const cachedProfile = await getProfileFromCache(otherUserId || userId);
  /* if (cachedProfile) {
    return cachedProfile;
  } */

  // If not in cache, fetch from database
  const user = await prisma.user.findUnique({
    where: { id: otherUserId || userId },
    omit: {
      fcmToken: true,
    },
    include: {
      profile: {
        omit: {
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      },
      ...(!otherUserId && {
        preference: {
          omit: {
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
      }),
    },
  });

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  let connections;
  if (otherUserId) {
    const uniqueKey = [userId, otherUserId].sort().join("_");

    connections = await prisma.connections.findUnique({
      where: {
        uniqueKey,
      },
      select: {
        id: true,
        status: true,
      },
    });
  }
  console.log(connections, "auth.service.ts", 276);
  const { password, createdAt, updatedAt, ...sanitizedUser } = user;

  // Store in cache for future requests
  await setProfileCache(userId, sanitizedUser);
  // await new Promise((resolve) => setTimeout(resolve, 5000)); // Blocks for 5 seconds

  await notificationQueue.add("notify", {
    title: "hellow",
  });

  return {
    ...sanitizedUser,
    ...(otherUserId && {
      connectionStatus: connections?.status || "NOT_CONNECTED",
    }),
  };
};

//w: (end)  ╰──────────── getProfile ────────────╯

//w: (start)╭──────────── updateProfile ────────────╮
const updateProfileIntoDB = async (
  userId: string,
  payload: UpdateProfileInput,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role)
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't change role");

  // Use transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Update user fields if provided
    const userUpdateData: any = {};

    if (payload.fullname !== undefined) {
      userUpdateData.fullname = payload.fullname;
    }

    if (payload.fcmToken !== undefined) {
      userUpdateData.fcmToken = payload.fcmToken;
    }

    if (payload.role !== undefined) {
      userUpdateData.role = payload.role;
    }

    // Update user if there are user fields to update
    let updatedUser = existingUser;
    if (Object.keys(userUpdateData).length > 0) {
      updatedUser = await tx.user.update({
        where: { id: userId },
        data: userUpdateData,
        include: {
          profile: true,
          preference: true,
        },
      });
    }

    // Update profile if provided and exists
    let updatedProfile = existingUser.profile;
    if (payload.profile && existingUser.profile) {
      const profileUpdateData: any = {};

      if (payload.profile.about !== undefined) {
        profileUpdateData.about = payload.profile.about;
      }

      if (payload.profile.age !== undefined) {
        profileUpdateData.age = payload.profile.age;
      }

      if (payload.profile.ethnicity !== undefined) {
        profileUpdateData.ethnicity = payload.profile.ethnicity;
      }

      if (payload.profile.gender !== undefined) {
        profileUpdateData.gender = payload.profile.gender;
      }

      if (payload.profile.profession !== undefined) {
        profileUpdateData.profession = payload.profile.profession;
      }

      if (payload.profile.experienceYear !== undefined) {
        profileUpdateData.experienceYear = payload.profile.experienceYear;
      }

      if (payload.profile.availability !== undefined) {
        profileUpdateData.availability = payload.profile.availability;
      }

      if (payload.profile.profileImage !== undefined) {
        profileUpdateData.profileImage = payload.profile.profileImage;
      }

      if (payload.profile.interests !== undefined) {
        profileUpdateData.interests = payload.profile.interests;
      }

      if (Object.keys(profileUpdateData).length > 0) {
        updatedProfile = await tx.profile.update({
          where: { userId: userId },
          data: profileUpdateData,
        });
      }
    } else if (payload.profile && !existingUser.profile) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Profile does not exist. Please complete your profile first.",
      );
    }

    // Update preference if provided and exists
    let updatedPreference = existingUser.preference;
    if (payload.preference && existingUser.preference) {
      const preferenceUpdateData: any = {};

      // 🛠️ FIX: Use ARRAY field names
      if (payload.preference.careers !== undefined) {
        preferenceUpdateData.careers = payload.preference.careers;
      }

      if (payload.preference.genders !== undefined) {
        preferenceUpdateData.genders = payload.preference.genders;
      }

      if (payload.preference.ethnicities !== undefined) {
        preferenceUpdateData.ethnicities = payload.preference.ethnicities;
      }

      if (payload.preference.notes !== undefined) {
        preferenceUpdateData.notes = payload.preference.notes;
      }

      if (payload.preference.age !== undefined) {
        preferenceUpdateData.age = payload.preference.age;
      }

      if (Object.keys(preferenceUpdateData).length > 0) {
        updatedPreference = await tx.preference.update({
          where: { userId: userId },
          data: preferenceUpdateData,
        });
      }
    } else if (payload.preference && !existingUser.preference) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Preference does not exist. Please complete your profile first.",
      );
    } // Clear cache after update
    await clearProfileCache(userId);

    return null;
  });

  return result;
};
//w: (end)  ╰──────────── updateProfile ────────────╯

//w: (start)╭──────────── completeProfile ────────────╮
/* const completeProfile = async (
  userId: string,
  payload: CompleteProfileInput,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Checking if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Profile already exists. Use update profile instead.",
    );
  }

  // Checking if preference already exists
  const existingPreference = await prisma.preference.findUnique({
    where: { userId },
  });

  if (existingPreference) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Preference already exists. Use update preference instead.",
    );
  }

  // transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Create profile
    const profile = await tx.profile.create({
      data: {
        about: payload.profile.about,
        age: payload.profile.age,
        ethnicity: payload.profile.ethnicity, // Note: This is a string (single ethnicity)
        gender: payload.profile.gender,
        profession: payload.profile.profession,
        experienceYear: payload.profile.experienceYear,
        availability: payload.profile.availability,
        profileImage: payload.profile.profileImage,
        interests: payload.profile.interests,
        userId: userId,
      },
    });

    // 🛠️ FIX: Create preference with ARRAY fields
    const preference = await tx.preference.create({
      data: {
        careers: payload.preference.careers,
        genders: payload.preference.genders,
        ethnicities: payload.preference.ethnicities,
        notes: payload.preference.notes,
        age: payload.preference.age,
        userId: userId,
      },
    });

    // Update user role if provided and profile status to COMPLETE
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        role: payload.role || existingUser.role,
        profilStatus: "COMPLETE",
      },
    });

    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string,
    );

    await clearProfileCache(userId);

    return {
      accessToken,
    };
  });

  return result;
}; */

const completeProfile = async (
  userId: string,
  payload: TCompleteProfileInput,
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Validate user existence INSIDE transaction
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }

      // 2️⃣ Create profile (will fail if already exists)
      await tx.profile.create({
        data: {
          ...payload.profile,
          userId,
        },
      });

      // 3️⃣ Create preference (will fail if already exists)
      await tx.preference.create({
        data: {
          ...payload.preference,
          userId,
        },
      });

      // 4️⃣ Update user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          role: payload.role ?? user.role,
          profilStatus: "COMPLETE",
        },
      });

      const accessToken = jwtHelpers.generateToken(
        {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        config.jwt.jwt_secret as string,
        config.jwt.expires_in as string,
      );

      await clearProfileCache(userId);

      return {
        accessToken,
        id: updatedUser.id,
        profileStatus: updatedUser.profilStatus,
        role: updatedUser.role,
      };
    });

    return result;
  } catch (error: any) {
    //  Translate DB uniqueness errors into API errors
    if (error.code === "P2002") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Profile or preference already exists. Use update instead.",
      );
    }

    throw error;
  }
};

//w: (end)  ╰──────────── completeProfile ────────────╯
//
//w: (start)╭──────────── updateProfileImage ────────────╮
const updateProfileImage = async (file: Express.Multer.File) => {
  if (file === undefined) {
    throw new ApiError(400, "Please select an image");
  }
  const fileUrl = await uploadInSpace(file, "users/profileImage");
  console.log(fileUrl, "auth.service.ts", 568);

  return fileUrl;
};
//w: (end)  ╰──────────── updateProfileImage ────────────╯

//w: (start)╭──────────── deleteAccount ────────────╮
const deleteAccountFromDB = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  console.log(deletedUser, "auth.service.ts", 395);
  await clearProfileCache(userId);

  return null;
};
//w: (end)  ╰──────────── deleteAccount ────────────╯

//w: (start)╭──────────── uploadFiles ────────────╮

const uploadFiles = async (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "Please select at least one file");
  }

  return Promise.all(files.map((file) => uploadInSpace(file, "users/files")));
};

//w: (end)  ╰──────────── uploadFiles ────────────╯

export const authService = {
  loginUserIntoDB,
  authLogin,
  getProfileFromDB,
  updateProfileIntoDB,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCodeDB,
  resetForgotPasswordDB,
  updateProfileImage,
  completeProfile,
  deleteAccountFromDB,
  uploadFiles,
};
