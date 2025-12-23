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
│   │   │   ├── entry.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   ├── optionalAuth.ts
│   │   │   ├── parseBodyData.ts
│   │   │   ├── postman.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.api.hurl
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── network
│   │   │   │   ├── matchsuggestionlogic.md
│   │   │   │   ├── network.api.hurl
│   │   │   │   ├── network.controller.ts
│   │   │   │   ├── networkFullContent.md
│   │   │   │   ├── network.routes.ts
│   │   │   │   ├── network.service.ts
│   │   │   │   └── network.validation.ts
│   │   │   └── user
│   │   │       ├── user.api.hurl
│   │   │       ├── user.controller.ts
│   │   │       ├── userFullContent.md
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
│   ├── jobs
│   │   ├── bullBoard.ts
│   │   ├── queues
│   │   │   └── emailQueue.ts
│   │   └── workers
│   │       └── emailWorker.ts
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
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

24 directories, 76 files
```

## 📁 auth Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/auth
├── auth.api.hurl
├── auth.controller.ts
├── auth.routes.ts
├── auth.service.ts
└── auth.validation.ts

1 directory, 5 files
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

  // Connection Requests (sent and received)
  sentRequests     ConnectionRequest[] @relation("SentRequests")
  receivedRequests ConnectionRequest[] @relation("ReceivedRequests")

  // Connections (as user1 or user2)
  connectionsAsUser1 Connection[] @relation("Connections1")
  connectionsAsUser2 Connection[] @relation("Connections2")

  @@map("users")
}

//w: (end)  ╰────────────  User  ────────────╯

//w: (start)╭────────────  Profile  ────────────╮
model Profile {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  about     String
  age       Int
  ethnicity String

  gender         Gender
  profession     String
  experienceYear Int
  availability   Json
  profileImage   String?
  interests      String[] @default([])
  userId         String   @unique @db.ObjectId
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("profiles")
}

//w: (end)  ╰──────────── Profile   ────────────╯

//w: (start)╭────────────  Preference  ────────────╮
model Preference {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  careers     String[]
  genders     Gender[]
  ethnicities String[]
  notes       String?
  age         AgeRange
  userId      String   @unique @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

//w: (end)  ╰──────────── Preference   ────────────╯

//w: (start)╭──────────── ConnectionRequest  ────────────╮
model ConnectionRequest {
  id         String        @id @default(auto()) @map("_id") @db.ObjectId
  senderId   String        @db.ObjectId
  sender     User          @relation("SentRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String        @db.ObjectId
  receiver   User          @relation("ReceivedRequests", fields: [receiverId], references: [id], onDelete: Cascade)
  status     RequestStatus @default(PENDING)
  message    String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  @@unique([senderId, receiverId])
  @@index([senderId, status])
  @@index([receiverId, status])
  @@map("connection_requests")
}

model Connection {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  user1Id   String   @db.ObjectId
  user1     User     @relation("Connections1", fields: [user1Id], references: [id], onDelete: Cascade)
  user2Id   String   @db.ObjectId
  user2     User     @relation("Connections2", fields: [user2Id], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([user1Id, user2Id])
  @@index([user1Id])
  @@index([user2Id])
  @@map("connections")
}

enum RequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}

//w: (end)  ╰──────────── ConnectionRequest  ────────────╯

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
    "start": "concurrently \"node ./dist/server.js\" \"node ./dist/workers/emailWorker.js\"",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "concurrently \"ts-node-dev --respawn --transpile-only src/server.ts\" \"ts-node-dev --respawn --transpile-only src/jobs/workers/emailWorker.ts\"",
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
    "@bull-board/express": "^6.15.0",
    "@prisma/client": "^6.3.0",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "agora-access-token": "^2.0.4",
    "bcryptjs": "^2.4.3",
    "bullmq": "^5.66.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-basic-auth": "^1.2.1",
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

      if (payload.preference.ethnicities !== undefined) {
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

router.get("/profile/:id", auth(), authController.getOtherProfile);

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
```

## 📝 auth.validation.ts

```ts
import { Gender, UserRole } from "@prisma/client";
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
      ethnicity: z.string().min(2, { message: "Ethnicity is required" }),
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
    // In completeProfileSchema, update preference object:
    preference: z.object({
      careers: z
        .array(
          z
            .string()
            .min(2, "Career must be at least 2 characters long")
            .max(100, "Career must be at most 100 characters long"),
        )
        .min(1, "At least one career preference is required")
        .max(10, "Maximum 10 career preferences allowed"),

      genders: z
        .array(z.nativeEnum(Gender))
        .min(0, "At least 0 gender preferences")
        .max(3, "Maximum 3 gender preferences allowed"),

      ethnicities: z
        .array(z.string().min(2))
        .min(0, "At least 0 ethnicity preferences"),

      notes: z
        .string()
        .max(500, "Notes must be at most 500 characters")
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
```

## 🎮 auth.controller.ts

```ts
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
  const id = req.params.id as string;
  console.log(id, "auth.controller.ts", 109);

  const user = await authService.getProfileFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
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
  const { id } = req.user;
  const fileUrl = await authService.updateProfileImage(id, req.file);
  console.log(fileUrl, "auth.controller.ts", 140);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile image uploaded successfully",
    data: fileUrl,
  });
});
//w: (end)  ╰──────────── updateProfileImage ────────────╯

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
  updateUserLocation,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtpCode,
  resetPassword,
  updateProfileImage,
  completeProfile,
  deleteAccount,
};
```

## 🧪 auth.api.hurl

```bash
SjAbc1@Bad

# email password  login

POST {{port6011}}/auth/login

{
  "email":"raisaahmed@merepost.com",
  "password":"SjAbc1@Bad",
  "fcmToken":""
}

# auth login / google login

POST {{port6011}}/auth/auth-login
{
  "email":"sara@merepost.com",
  "fullname":"Sara Ahmed",
  "fcmToken":""
}

# upload profile image file

PACTH {{port6011}}/auth/profile-image
Authorization: {{ashRaisa}}




# get my profile
GET {{port6011}}/auth/profile
Authorization: {{ashRaisa}}

# get other profile
# profile/userId
GET {{port6011}}/auth/profile/69439c27b63cdd027fe1e8c6
Authorization: {{ashRaisa}}

# Delete Account
# Note: This will permanently delete the user account and all associated data

DELETE {{port6011}}/auth/delete-account
Authorization: {{ashEsha}}

# send forgot password otp

POST {{port6011}}/auth/send-forgot-otp
{
   "email":"yousufbinhadi@merepost.com"
}

# verify forgot password otp
POST {{port6011}}/auth/verify-forgot-otp
{
   "email":"yousufbinhadi@merepost.com",
   "otp":"7565"
}


# reset password

PATCH {{port6011}}/auth/reset-password
Authorization: {{tempToken}}
{
   "newPassword":"SjAbc1@Bad"
}


# Complete Profile (Mentee Example)
POST {{port6011}}/auth/complete-profile
Authorization: {{ashHasan}}
Content-Type: application/json


{
  "profile": {
    "about": "I am an early-stage startup professional aiming to strengthen my marketing and growth strategy skills through expert mentorship and hands-on learning.",
    "age": 26,
    "ethnicity": "EAST_ASIAN",
    "gender": "MALE",
    "profession": "Startup Operations Associate",
    "experienceYear": 3,
    "availability": {
      "monday": [
        { "start": "20:00", "end": "21:00" }
      ],
      "wednesday": [
        { "start": "16:00", "end": "20:00" }
      ],
      "sunday": [
        { "start": "08:00", "end": "13:00" }
      ]
    },
    "profileImage": "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1766055758422-o1znpme52q.png",
    "interests": [
      "Startup Growth",
      "Digital Marketing",
      "Business Strategy",
      "Customer Acquisition"
    ]
  },

  "preference": {
    "career": "Business & Marketing",
    "gender": "MALE",
    "ethnicity": "MIDDLE_EASTERN",
    "notes": "Looking for a mentor with strong brand-building and data-driven marketing experience.",
    "age": {
      "min": 28,
      "max": 45
    }
  },

  "role": "MENTEE"
}




###
# Complete Profile (Mentor Example)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Senior software engineer with 8 years of experience in backend systems, cloud infrastructure, and team leadership. Passionate about mentoring and helping junior developers grow.",
    "age": 32,
    "ethnicity": "HISPANIC",
    "gender": "FEMALE",
    "profession": "Senior Software Engineer",
    "experienceYear": "8+ years",
    "availability": {
      "monday": [
        { "start": "10:00", "end": "12:00" },
        { "start": "14:00", "end": "16:00" }
      ],
      "wednesday": [
        { "start": "09:00", "end": "11:00" },
        { "start": "13:00", "end": "17:00" }
      ],
      "thursday": [
        { "start": "15:00", "end": "18:00" }
      ]
    },
    "profileImage": "https://example.com/mentor-profile.jpg",
    "interests": ["Backend Development", "Cloud Computing", "System Design", "Leadership"]
  },
  "preference": {
    "career": "Tech Industry",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "notes": "Looking to mentor someone who is committed and has basic programming knowledge",
    "age": {
      "min": 20,
      "max": 30
    }
  },
  "role": "MENTOR"
}

###
# Complete Profile (Minimal Example - MENTEE)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Looking to learn and grow in my career",
    "age": 24,
    "ethnicity": "BLACK",
    "gender": "NO_ANSWER",
    "profession": "Junior Developer",
    "experienceYear": "6 months",
    "availability": {
      "saturday": [
        { "start": "10:00", "end": "14:00" }
      ],
      "sunday": [
        { "start": "13:00", "end": "17:00" }
      ]
    },
    "interests": ["Programming", "Learning"]
  },
  "preference": {
    "career": "Software Engineering",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 28,
      "max": 45
    }
  }
}

###
# Complete Profile (Without role - uses existing role)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "I am a product manager looking to mentor aspiring product managers",
    "age": 35,
    "ethnicity": "MIDDLE_EASTERN",
    "gender": "MALE",
    "profession": "Product Manager",
    "experienceYear": "7 years",
    "availability": {
      "tuesday": [
        { "start": "19:00", "end": "21:00" }
      ],
      "thursday": [
        { "start": "20:00", "end": "22:00" }
      ]
    },
    "interests": ["Product Management", "Business Strategy", "User Research"]
  },
  "preference": {
    "career": "Product Management",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 22,
      "max": 35
    }
  }
}

###
# Complete Profile (For ADMIN role - optional)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Platform administrator with system management responsibilities",
    "age": 40,
    "ethnicity": "WHITE",
    "gender": "FEMALE",
    "profession": "System Administrator",
    "experienceYear": "12 years",
    "availability": {
      "monday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "tuesday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "wednesday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "thursday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "friday": [
        { "start": "09:00", "end": "17:00" }
      ]
    },
    "interests": ["System Administration", "Security", "DevOps"]
  },
  "preference": {
    "career": "IT Administration",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 25,
      "max": 50
    }
  },
  "role": "ADMIN"
}


##-------### ------###----## update profile
# ... existing tests ...

###
# Update Profile - Update only user fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "fullname": "Raisa Ahmed",
  "role": "MENTOR"
}

###
# Update Profile - Update only profile fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "profile": {
    "about": "Updated about section with more details about my experience and goals.",
    "age": 23,
    "profession": "Senior Software Developer",
    "experienceYear": 2,
    "interests": ["Web Development", "Mobile Apps", "UI/UX Design", "Databases", "Cloud Computing"],
    "availability": {
      "monday": [
        { "start": "10:00", "end": "13:00" },
        { "start": "15:00", "end": "18:00" }
      ],
      "wednesday": [
        { "start": "09:00", "end": "12:00" }
      ]
    }
  }
}

###
# Update Profile - Update only preference fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "preference": {
    "career": "Tech Startup",
    "gender": "FEMALE",
    "ethnicity": "EAST_ASIAN",
    "notes": "Looking for someone with startup experience",
    "age": {
      "min": 28,
      "max": 45
    }
  }
}

###
# Update Profile - Update mixed fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "fullname": "Raisa Ahmed Pro",
  "profile": {
    "profession": "Lead Developer",
    "experienceYear": 3
  },
  "preference": {
    "career": "Enterprise Software",
    "age": {
      "min": 30
    }
  }
}

###
# Update Profile - Clear profile image (set to empty string)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "profile": {
    "profileImage": ""
  }
}

###
# Update Profile - Clear notes
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "preference": {
    "notes": ""
  }
}

###
# Update Profile - Invalid data (should fail validation)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "fullname": "A",  // Too short
  "profile": {
    "age": 17  // Too young
  }
}

###
# Update Profile - Empty request (should fail)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{}

###
# Update Profile - Try to update email (should not be allowed)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "email": "newemail@example.com"  // This should be ignored or cause error
}

###
# Update Profile - Update availability with invalid time format
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "profile": {
    "availability": {
      "monday": [
        { "start": "25:00", "end": "26:00" }  // Invalid time
      ]
    }
  }
}

###
# Update Profile - Update with invalid age range
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "preference": {
    "age": {
      "min": 50,
      "max": 30  // min > max
    }
  }
}

###
# Update Profile - User without profile/preference (should fail)
# First create a user without completing profile
POST {{port6011}}/auth/auth-login
{
  "email": "newuser@example.com",
  "fullname": "New User",
  "fcmToken": ""
}

@newUserToken = {{response.body.data.accessToken}}

# Try to update profile (should fail because profile doesn't exist)
PUT {{port6011}}/auth/profile
Authorization: Bearer {{newUserToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Trying to update without completing profile"
  }
}

# Complete the profile first
POST {{port6011}}/auth/complete-profile
Authorization: Bearer {{newUserToken}}
Content-Type: application/json

{
  "profile": {
    "about": "I am a new user",
    "age": 25,
    "ethnicity": "EAST_ASIAN",
    "gender": "NO_ANSWER",
    "profession": "Developer",
    "experienceYear": 1,
    "availability": {
      "monday": [
        { "start": "09:00", "end": "12:00" }
      ]
    },
    "interests": ["Programming"]
  },
  "preference": {
    "career": "Software",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 20,
      "max": 30
    }
  }
}

# Now update should work
PUT {{port6011}}/auth/profile
Authorization: Bearer {{newUserToken}}
Content-Type: application/json

{
  "profile": {
    "profession": "Senior Developer"
  }
}

###
# Update Profile - Get updated profile to verify
GET {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
```
