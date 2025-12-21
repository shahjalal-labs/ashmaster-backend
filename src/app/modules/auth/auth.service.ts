import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import {
  Ethnicity,
  Gender,
  Profile,
  ProfilStatus,
  User,
  UserRole,
} from "@prisma/client";
import generateOTP from "../../../helpers/generateOtp";
import { uploadInSpace } from "../../../shared/uploadInSpace";
import { Secret } from "jsonwebtoken";
import { redisOtpService } from "../../../shared/redis-services/otp.service";
import httpStatus from "http-status";
import { UpdateProfileInput } from "./auth.validation";
import redisClient from "../../../shared/redis";
import { emailQueue } from "../../../jobs/queues/emailQueue";

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
    profileStatus: user.profilStatus,
  };
};
//w: (end)  ╰──────────── loginUserIntoDB ────────────╯

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
      profileStatus: user.profilStatus,
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
      profileStatus: ProfilStatus.INCOMPLETE,
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

//w: (start)╭──────────── getProfileFromDB ────────────╮
const getProfileFromDB = async (userId: string) => {
  // Try to get from cache first
  const cachedProfile = await getProfileFromCache(userId);
  if (cachedProfile) {
    return cachedProfile;
  }

  // If not in cache, fetch from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      preference: {
        omit: {
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, createdAt, updatedAt, ...sanitizedUser } = user;

  // Store in cache for future requests
  await setProfileCache(userId, sanitizedUser);

  return sanitizedUser;
};
//w: (end)  ╰──────────── getProfileFromDB ────────────╯

//w: (start)╭──────────── updateProfileIntoDB ────────────╮
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

      if (payload.preference.career !== undefined) {
        preferenceUpdateData.career = payload.preference.career;
      }

      if (payload.preference.gender !== undefined) {
        preferenceUpdateData.gender = payload.preference.gender;
      }

      if (payload.preference.ethnicity !== undefined) {
        preferenceUpdateData.ethnicity = payload.preference.ethnicity;
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
    }

    // Clear cache after update
    await clearProfileCache(userId);

    return null;
  });

  return result;
};
//w: (end)  ╰──────────── updateProfileIntoDB ────────────╯

//w: (start)╭──────────── completeProfile ────────────╮
const completeProfile = async (
  userId: string,
  payload: CompleteProfileInput,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Profile already exists. Use update profile instead.",
    );
  }

  // Check if preference already exists
  const existingPreference = await prisma.preference.findUnique({
    where: { userId },
  });

  if (existingPreference) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Preference already exists. Use update preference instead.",
    );
  }

  // Use transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Create profile
    const profile = await tx.profile.create({
      data: {
        about: payload.profile.about,
        age: payload.profile.age,
        ethnicity: payload.profile.ethnicity,
        gender: payload.profile.gender,
        profession: payload.profile.profession,
        experienceYear: payload.profile.experienceYear,
        availability: payload.profile.availability,
        profileImage: payload.profile.profileImage,
        interests: payload.profile.interests,
        userId: userId,
      },
    });

    // Create preference
    const preference = await tx.preference.create({
      data: {
        career: payload.preference.career,
        gender: payload.preference.gender,
        ethnicity: payload.preference.ethnicity,
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

    // Clear cache after profile completion
    await clearProfileCache(userId);

    return {
      accessToken,
    };
  });

  return result;
};
//w: (end)  ╰──────────── completeProfile ────────────╯
////w: (start)╭──────────── updateProfileImage ────────────╮
const updateProfileImage = async (
  userId: string,
  file: Express.Multer.File,
) => {
  if (file === undefined) {
    throw new ApiError(400, "Please select an image");
  }
  const fileUrl = await uploadInSpace(file, "users/profileImage");
  console.log(fileUrl, "auth.service.ts", 568);

  return fileUrl;
};
//w: (end)  ╰──────────── updateProfileImage ────────────╯

interface CompleteProfileInput {
  profile: {
    about: string;
    age: number;
    ethnicity: Ethnicity;
    gender: Gender;
    profession: string;
    experienceYear: number;
    availability: Record<string, { start: string; end: string }[]>;
    profileImage?: string;
    interests: string[];
  };
  preference: {
    career: string;
    gender: Gender;
    ethnicity: Ethnicity;
    notes?: string;
    age: {
      min: number;
      max: number;
    };
  };
  role?: UserRole;
}

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
  return null;
};
//w: (end)  ╰──────────── deleteAccount ────────────╯

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
  deleteAccountFromDB,
};
