# networkFullContent.md

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
│   │   │   │   ├── authFullContent.md
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── network
│   │   │   │   ├── network.api.hurl
│   │   │   │   ├── network.controller.ts
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

24 directories, 75 files
```

## 📁 network Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/network
├── network.api.hurl
├── network.controller.ts
├── network.routes.ts
├── network.service.ts
└── network.validation.ts

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
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  about          String
  age            Int
  ethnicity      Ethnicity
  gender         Gender
  profession     String
  experienceYear Int
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
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
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

## 🎮 network.controller.ts

```ts
import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { networkService } from "./network.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

// Get network suggestions
const getSuggestions = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { page = 1, limit = 10, filter = "all", search } = req.query;

  const result = await networkService.getSuggestions(id, {
    page: Number(page),
    limit: Number(limit),
    filter,
    search,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestions retrieved successfully",
    data: result,
  });
});

// Send connection request
const sendConnectionRequest = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await networkService.sendConnectionRequest(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Connection request sent successfully",
    data: result,
  });
});

// Get pending requests
const getPendingRequests = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const result = await networkService.getPendingRequests(id, {
    page: Number(page),
    limit: Number(limit),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending requests retrieved successfully",
    data: result,
  });
});

// Accept/reject connection request
const updateRequestStatus = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await networkService.updateRequestStatus(id, req.body);

  const message =
    req.body.status === "ACCEPTED"
      ? "Connection request accepted"
      : "Connection request rejected";

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    data: result,
  });
});

// Get all connections
const getConnections = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const result = await networkService.getConnections(id, {
    page: Number(page),
    limit: Number(limit),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Connections retrieved successfully",
    data: result,
  });
});

// Remove connection
const removeConnection = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { connectionId } = req.params;

  const result = await networkService.removeConnection(id, connectionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Connection removed successfully",
    data: result,
  });
});

// Get network stats
const getNetworkStats = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const result = await networkService.getNetworkStats(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Network stats retrieved successfully",
    data: result,
  });
});

export const networkController = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  updateRequestStatus,
  getConnections,
  removeConnection,
  getNetworkStats,
};
```

## 📝 network.validation.ts

```ts
import { z } from "zod";
import { RequestStatus } from "@prisma/client";

// Pagination validation
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Send connection request
const sendRequestSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  message: z
    .string()
    .max(500, "Message must be at most 500 characters")
    .optional(),
});

// Update request status
const updateRequestStatusSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  status: z.nativeEnum(RequestStatus, {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});

// Get recommendations query
const recommendationsQuerySchema = paginationSchema.extend({
  filter: z.enum(["all", "mentors", "mentees"]).default("all"),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SendRequestInput = z.infer<typeof sendRequestSchema>;
export type UpdateRequestStatusInput = z.infer<
  typeof updateRequestStatusSchema
>;
export type RecommendationsQuery = z.infer<typeof recommendationsQuerySchema>;

export const networkValidation = {
  paginationSchema,
  sendRequestSchema,
  updateRequestStatusSchema,
  recommendationsQuerySchema,
};
```

## 🔧 network.routes.ts

```ts
import express from "express";
import { networkController } from "./network.controller";
import validateRequest from "../../middlewares/validateRequest";
import { networkValidation } from "./network.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

//w: (start)╭──────────── Network Routes ────────────╮

// Get suggestions (for home page)
router.get(
  "/suggestions",
  auth(),
  validateRequest(networkValidation.recommendationsQuerySchema, "query"),
  networkController.getSuggestions,
);

// Send connection request
router.post(
  "/request",
  auth(),
  validateRequest(networkValidation.sendRequestSchema),
  networkController.sendConnectionRequest,
);

// Get pending requests (sent and received)
router.get(
  "/requests/pending",
  auth(),
  validateRequest(networkValidation.paginationSchema, "query"),
  networkController.getPendingRequests,
);

// Accept/reject connection request
router.patch(
  "/request/status",
  auth(),
  validateRequest(networkValidation.updateRequestStatusSchema),
  networkController.updateRequestStatus,
);

// Get all connections
router.get(
  "/connections",
  auth(),
  validateRequest(networkValidation.paginationSchema, "query"),
  networkController.getConnections,
);

// Remove connection
router.delete(
  "/connection/:connectionId",
  auth(),
  networkController.removeConnection,
);

// Get network stats
router.get("/stats", auth(), networkController.getNetworkStats);

//w: (end)  ╰──────────── Network Routes ────────────╯

export const NetworkRoutes = router;
```

## 🧪 network.api.hurl

```bash
# Network Module API Tests

# Get network stats
GET {{port6011}}/network/stats
Authorization: {{ashEsha}}

# Get suggestions (for home page)
GET {{port6011}}/network/suggestions?page=1&limit=16
Authorization: {{ashRaisa}}

# Get suggestions filtered by role
GET {{port6011}}/network/suggestions?page=1&limit=10&filter=mentors
Authorization: {{ashRaisa}}

# Send connection request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "receiverId": "69439c27b63cdd027fe1e8c6",
  "message": "Hi, I'd like to connect with you for mentorship."
}

# Get pending requests
GET {{port6011}}/network/requests/pending?page=1&limit=10
Authorization: {{ashSharif }}

# Accept connection request
PATCH {{port6011}}/network/request/status
Authorization: {{ashEsha}} # This should be the receiver of the request
Content-Type: application/json

{
  "requestId": "6943b9bcb63cdd027fe1e8c9",
  "status": "ACCEPTED"
}

# Reject connection request
PATCH {{port6011}}/network/request/status
Authorization: {{ashEsha}}
Content-Type: application/json

{
  "requestId": "6943b9bcb63cdd027fe1e8c9",
  "status": "REJECTED"
}

# Get all connections
GET {{port6011}}/network/connections?page=1&limit=10
Authorization: {{ashRaisa}}

# Remove connection
DELETE {{port6011}}/network/connection/39284920784901237
Authorization: {{ashRaisa}}
```

## 🛠️ network.service.ts

```ts
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma, UserRole } from "@prisma/client";
import {
  PaginationInput,
  SendRequestInput,
  UpdateRequestStatusInput,
  RecommendationsQuery,
} from "./network.validation";

import redisClient from "../../../shared/redis";

// Cache keys
const CACHE_PREFIX = "network:";
const SUGGESTIONS_CACHE_TTL = 300; // 5 minutes
const CONNECTIONS_CACHE_TTL = 600; // 10 minutes

// Helper to get cache key
const getCacheKey = (
  userId: string,
  type: string,
  page: number,
  limit: number,
  filter?: string,
): string => {
  return `${CACHE_PREFIX}${type}:${userId}:${filter || "all"}:${page}:${limit}`;
};

// Clear cache for user
const clearUserNetworkCache = async (userId: string): Promise<void> => {
  try {
    const pattern = `${CACHE_PREFIX}*:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error("Failed to clear network cache:", error);
  }
};

//w: (start)╭──────────── getUserWithDetails ────────────╮
// Get user with profile and preference
const getUserWithDetails = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
    },
  });
};
//w: (end)  ╰──────────── getUserWithDetails ────────────╯

//w: (start)╭──────────── getSuggestions ────────────╮
// Get suggestions based on user role and preference
const getSuggestionsFromDB = async (
  userId: string,
  query: RecommendationsQuery,
) => {
  const user = await getUserWithDetails(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { page, limit, skip, filter } = query;

  // Determine target role based on user role and filter
  let targetRole: UserRole | undefined;
  if (filter === "mentors") {
    targetRole = UserRole.MENTOR;
  } else if (filter === "mentees") {
    targetRole = UserRole.MENTEE;
  } else {
    targetRole =
      user.role === UserRole.MENTOR ? UserRole.MENTEE : UserRole.MENTOR;
  }

  // Build where clause for suggestions
  const whereClause: Prisma.UserWhereInput = {
    id: { not: userId },
    role: targetRole,
    profilStatus: "COMPLETE",
    AND: [],
  };

  // Apply preference filters if user has preference
  if (user.preference) {
    const preferenceConditions = [];

    // Age range filter
    if (user.preference.age) {
      preferenceConditions.push({
        profile: {
          age: {
            gte: user.preference.age.min,
            lte: user.preference.age.max,
          },
        },
      });
    }

    // Gender filter (skip if NO_ANSWER)
    if (user.preference.gender !== "NO_ANSWER") {
      preferenceConditions.push({
        profile: {
          gender: user.preference.gender,
        },
      });
    }

    // Ethnicity filter (skip if NO_ANSWER)
    if (user.preference.ethnicity !== "NO_ANSWER") {
      preferenceConditions.push({
        profile: {
          ethnicity: user.preference.ethnicity,
        },
      });
    }

    // Career/Profession filter
    if (user.preference.career) {
      preferenceConditions.push({
        OR: [
          {
            profile: {
              profession: {
                contains: user.preference.career,
                mode: "insensitive",
              },
            },
          },
          { profile: { interests: { has: user.preference.career } } },
        ],
      });
    }

    if (preferenceConditions.length > 0) {
      whereClause.AND = preferenceConditions;
    }
  }

  // Get users that the current user is already connected with or has pending requests
  const [existingConnections, pendingRequests] = await Promise.all([
    prisma.connection.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    }),
    prisma.connectionRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: "PENDING",
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    }),
  ]);

  // Get all user IDs to exclude
  const excludedUserIds = [
    ...existingConnections.map((c) =>
      c.user1Id === userId ? c.user2Id : c.user1Id,
    ),
    ...pendingRequests.map((r) =>
      r.senderId === userId ? r.receiverId : r.senderId,
    ),
  ];

  if (excludedUserIds.length > 0) {
    whereClause.id = {
      not: {
        in: excludedUserIds,
      },
    };
  }

  // Get total count
  const total = await prisma.user.count({ where: whereClause });

  // Get paginated suggestions
  const suggestions = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
      profile: {
        select: {
          about: true,
          age: true,
          profession: true,
          experienceYear: true,
          profileImage: true,
          interests: true,
          gender: true,
          ethnicity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  // Calculate match percentage based on preference
  const suggestionsWithMatch = suggestions.map((suggestion) => {
    let matchPercentage = 0;
    let matchReasons: string[] = [];

    if (user.preference && suggestion.profile) {
      // Age match
      if (user.preference.age) {
        if (
          suggestion.profile.age >= user.preference.age.min &&
          suggestion.profile.age <= user.preference.age.max
        ) {
          matchPercentage += 25;
          matchReasons.push("Age matches your preference");
        }
      }

      // Gender match
      if (
        user.preference.gender !== "NO_ANSWER" &&
        user.preference.gender === suggestion.profile.gender
      ) {
        matchPercentage += 25;
        matchReasons.push("Gender matches your preference");
      }

      // Ethnicity match
      if (
        user.preference.ethnicity !== "NO_ANSWER" &&
        user.preference.ethnicity === suggestion.profile.ethnicity
      ) {
        matchPercentage += 25;
        matchReasons.push("Ethnicity matches your preference");
      }

      // Career/Profession match
      if (user.preference.career) {
        const lowerCareer = user.preference.career.toLowerCase();
        const lowerProfession = suggestion.profile.profession.toLowerCase();
        const lowerInterests = suggestion.profile.interests.map((i) =>
          i.toLowerCase(),
        );

        if (
          lowerProfession.includes(lowerCareer) ||
          lowerInterests.some((interest) => interest.includes(lowerCareer))
        ) {
          matchPercentage += 25;
          matchReasons.push("Career/interest matches your preference");
        }
      }
    }

    console.log(whereClause, "network.service.ts", 82);

    return {
      ...suggestion,
      matchPercentage,
      matchReasons,
    };
  });

  // Sort by match percentage (highest first)
  suggestionsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: suggestionsWithMatch,
    userRole: user.role,
    targetRole,
  };
};
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── sendConnectionRequest ────────────╮
// Send connection request
const sendConnectionRequest = async (
  senderId: string,
  payload: SendRequestInput,
) => {
  // Check if sender and receiver exist
  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: senderId } }),
    prisma.user.findUnique({ where: { id: payload.receiverId } }),
  ]);

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const oppositeRole = sender.role === "MENTOR" ? "MENTEE" : "MENTOR";

  if (sender.role === receiver.role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can connect with only ${oppositeRole}`,
    );
  }

  // Check if users are already connected
  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { user1Id: senderId, user2Id: payload.receiverId },
        { user1Id: payload.receiverId, user2Id: senderId },
      ],
    },
  });

  if (existingConnection) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already connected");
  }

  // Check if there's a pending request
  const existingRequest = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId: payload.receiverId },
        { senderId: payload.receiverId, receiverId: senderId },
      ],
      status: "PENDING",
    },
  });

  if (existingRequest) {
    if (existingRequest.senderId === senderId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Request already sent");
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You have a pending request from this user",
      );
    }
  }

  // Create connection request
  const request = await prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId: payload.receiverId,
      message: payload.message,
    },
  });

  // Clear cache for both users
  await Promise.all([
    clearUserNetworkCache(senderId),
    clearUserNetworkCache(payload.receiverId),
  ]);

  return request;
};
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequests ────────────╮
// Get pending requests (sent and received)
const getPendingRequests = async (userId: string, query: PaginationInput) => {
  const { page, limit, skip } = query;

  const whereClause = {
    receiverId: userId,
  };

  const [requests, total] = await Promise.all([
    prisma.connectionRequest.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.connectionRequest.count({ where: whereClause }),
  ]);

  // Format response

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: requests,
  };
};
//w: (end)  ╰──────────── getPendingRequests ────────────╯

//w: (start)╭──────────── updateRequestStatus ────────────╮
// Update request status (accept/reject)
const updateRequestStatus = async (
  userId: string,
  payload: UpdateRequestStatusInput,
) => {
  const request = await prisma.connectionRequest.findUnique({
    where: { id: payload.requestId },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.receiverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update requests sent to you",
    );
  }

  if (request.status !== "PENDING") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request is already processed");
  }

  // Start transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update request status
    const updatedRequest = await tx.connectionRequest.update({
      where: { id: payload.requestId },
      data: { status: payload.status },
    });

    // If accepted, create connection
    if (payload.status === "ACCEPTED") {
      // Determine order of user IDs for consistent connection storage
      const [user1Id, user2Id] = [request.senderId, request.receiverId].sort();

      await tx.connection.create({
        data: {
          user1Id,
          user2Id,
        },
      });
    }

    return updatedRequest;
  });

  // Clear cache for both users
  await Promise.all([
    clearUserNetworkCache(request.senderId),
    clearUserNetworkCache(request.receiverId),
  ]);

  return result;
};
//w: (end)  ╰──────────── updateRequestStatus ────────────╯

//w: (start)╭──────────── getConnections ────────────╮
// Get all connections
const getConnections = async (userId: string, query: PaginationInput) => {
  const { page, limit, skip } = query;

  const cacheKey = getCacheKey(userId, "connections", page, limit);

  // Try to get from cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Get connections where user is either user1 or user2
  const whereClause = {
    OR: [{ user1Id: userId }, { user2Id: userId }],
  };

  const [connections, total] = await Promise.all([
    prisma.connection.findMany({
      where: whereClause,
      include: {
        user1: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
                experienceYear: true,
                about: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
                experienceYear: true,
                about: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.connection.count({ where: whereClause }),
  ]);

  // Format response - get the other user
  const formattedConnections = connections.map((connection) => ({
    ...connection,
    otherUser:
      connection.user1Id === userId ? connection.user2 : connection.user1,
    connectedSince: connection.createdAt,
  }));

  const result = {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: formattedConnections,
  };

  // Cache the result
  try {
    await redisClient.setex(
      cacheKey,
      CONNECTIONS_CACHE_TTL,
      JSON.stringify(result),
    );
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return result;
};
//w: (end)  ╰──────────── getConnections ────────────╯

//w: (start)╭──────────── getSuggestions ────────────╮
// Get suggestions with caching
const getSuggestions = async (userId: string, query: RecommendationsQuery) => {
  const { page, limit, filter } = query;
  const cacheKey = getCacheKey(userId, "suggestions", page, limit, filter);

  // Try to get from cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Get fresh data from DB
  const result = await getSuggestionsFromDB(userId, query);

  // Cache the result
  try {
    await redisClient.setex(
      cacheKey,
      SUGGESTIONS_CACHE_TTL,
      JSON.stringify(result),
    );
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return result;
};
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── removeConnection ────────────╮
// Remove connection
const removeConnection = async (userId: string, connectionId: string) => {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new ApiError(httpStatus.NOT_FOUND, "Connection not found");
  }

  if (connection.user1Id !== userId && connection.user2Id !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only remove your own connections",
    );
  }

  // Delete connection
  await prisma.connection.delete({
    where: { id: connectionId },
  });

  // Clear cache for both users
  await Promise.all([
    clearUserNetworkCache(connection.user1Id),
    clearUserNetworkCache(connection.user2Id),
  ]);

  return null;
};
//w: (end)  ╰──────────── removeConnection ────────────╯

//w: (start)╭──────────── getNetworkStats ────────────╮
// Get network stats (counts)
const getNetworkStats = async (userId: string) => {
  const cacheKey = `${CACHE_PREFIX}stats:${userId}`;

  // Try to get from cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  const [connectionsCount, sentRequestsCount, receivedRequestsCount] =
    await Promise.all([
      prisma.connection.count({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      }),
      prisma.connectionRequest.count({
        where: {
          senderId: userId,
          status: "PENDING",
        },
      }),
      prisma.connectionRequest.count({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
      }),
    ]);

  const stats = {
    connections: connectionsCount,
    sentRequests: sentRequestsCount,
    receivedRequests: receivedRequestsCount,
    totalPending: sentRequestsCount + receivedRequestsCount,
  };

  // Cache for 2 minutes
  try {
    await redisClient.setex(cacheKey, 120, JSON.stringify(stats));
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return stats;
};
//w: (end)  ╰──────────── getNetworkStats ────────────╯

export const networkService = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  updateRequestStatus,
  getConnections,
  removeConnection,
  getNetworkStats,
  clearUserNetworkCache,
};
```
