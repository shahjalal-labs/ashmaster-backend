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
│   │   │   ├── profile.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.api.hurl
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── authFullContent.md
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   │   └── profiledata.md
│   │   │   ├── network
│   │   │   │   ├── matchsuggestionlogic.md
│   │   │   │   ├── network.api.hurl
│   │   │   │   ├── network.controller.ts
│   │   │   │   ├── network.routes.ts
│   │   │   │   ├── network.service.ts
│   │   │   │   └── network.validation.ts
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
│       ├── paginationHelper.ts
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

24 directories, 77 files
```

## 📁 network Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/network
├── matchsuggestionlogic.md
├── network.api.hurl
├── network.controller.ts
├── network.routes.ts
├── network.service.ts
└── network.validation.ts

1 directory, 6 files
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
  genders     PreferenceGender []
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

enum Gender {
  MALE
  FEMALE
  NO_ANSWER // prefer not say
}

enum PreferenceGender {
  MALE
  FEMALE
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
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

// Get network suggestions
//w: (start)╭──────────── getSuggestions ────────────╮
const getSuggestions = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const options = pick(req.query, paginationOptions);

  const result = await networkService.getSuggestions(id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestions retrieved successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getSuggestions ────────────╯

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

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SendRequestInput = z.infer<typeof sendRequestSchema>;
export type UpdateRequestStatusInput = z.infer<
  typeof updateRequestStatusSchema
>;

export const networkValidation = {
  paginationSchema,
  sendRequestSchema,
  updateRequestStatusSchema,
};
```

## 📖 matchsuggestionlogic.md

```markdown
---

## connection suggestion logic

1. exact match needed (we using AND operator)
2. excluding own profile
3. excluding those are already connected
4. excluding those are already pending (from both side, sender or reciever)
5. match based on interests, checking logged in user interest with other user interest through in operator,
6. match with the preference settings, where array using in operator
7. availability with in operator meaning any slot if matches then get result. if availability doesn't match with anyone still get in suggestions but who matches availability come first in order.
```

## 🔧 network.routes.ts

```ts
import express from "express";
import { networkController } from "./network.controller";
import validateRequest from "../../middlewares/validateRequest";
import { networkValidation } from "./network.validation";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";

const router = express.Router();

//w: (start)╭──────────── Network Routes ────────────╮

// Get suggestions (for home page)
router.get(
  "/suggestions",
  auth(),
  profileGuard(),
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
# Simple Network Tests

# Get suggestions
GET {{port6011}}/network/suggestions?page=1&limit=10
Authorization: {{ashRaisa}}

# Send request
POST {{port6011}}/network/request
Authorization: {{yourToken}}
Content-Type: application/json

{
  "receiverId": "otherUserId",
  "message": "Hi, let's connect!"
}

# Accept request
PATCH {{port6011}}/network/request/status
Authorization: {{yourToken}}
Content-Type: application/json

{
  "requestId": "requestId123",
  "status": "ACCEPTED"
}
```

## 🛠️ network.service.ts

```ts
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma, UserRole, RequestStatus } from "@prisma/client";

import {
  PaginationInput,
  SendRequestInput,
  UpdateRequestStatusInput,
} from "./network.validation";
import { paginationHelper, TOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── getSuggestions ────────────╮
const getSuggestions = async (userId: string, options: TOptions) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    include: {
      profile: true,
      preference: true,
    },
  });

  const pendingOrConnectedUser = [];
  const { page, limit, skip } = paginationHelper.calcalutePagination(options);

  const genderProfileFilter: Prisma.ProfileWhereInput | undefined = user
    .preference?.genders?.length
    ? {
        OR: [
          {
            gender: {
              in: user.preference.genders,
            },
          },
          {
            gender: "NO_ANSWER",
          },
        ],
      }
    : undefined; //  no filtering at all

  const whereClause: Prisma.UserWhereInput = {
    id: {
      not: userId,
    },
    profilStatus: {
      not: "INCOMPLETE",
    },
    role: {
      // mentee will get mentor and mentor will get mentee only
      notIn: [user.role, UserRole.ADMIN],
    },
    profile: {
      interests: {
        hasSome: user.profile?.interests,
      },
      age: {
        gte: user.preference?.age.min,
        lte: user.preference?.age.max,
      },
      ethnicity: {
        in: user.preference?.ethnicities,
      },
      profession: {
        in: user.preference?.careers,
      },
      ...(genderProfileFilter ?? {}),
    },
  };
  const suggestedUsers = await prisma.user.findMany({
    /*  {
           id: {
        not: userId,
      },
      profilStatus: {
        not: "INCOMPLETE",
      },
      role: {
        // mentee will get mentor and mentor will get mentee only
        notIn: [user.role, UserRole.ADMIN],
      },
      profile: {
        interests: {
          hasSome: user.profile?.interests,
        },
        age: {
          gte: user.preference?.age.min,
          lte: user.preference?.age.max,
        },
        ethnicity: {
          in: user.preference?.ethnicities,
        },
        profession: {
          in: user.preference?.careers,
        },
        ...(genderProfileFilter ?? {}),
      },
    },  */
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    omit: {
      password: true,
      fcmToken: true,
      // profilStatus: true,
    },
    include: {
      profile: true,
      preference: true,
    },
  });

  const total = await prisma.user.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    data: suggestedUsers,
  };
};
//w: (end)  ╰──────────── getSuggestions ────────────╯

// Send connection request
const sendConnectionRequest = async (
  senderId: string,
  payload: SendRequestInput,
) => {
  const { receiverId, message } = payload;

  if (senderId === receiverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot send request to yourself",
    );
  }

  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: senderId } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ]);

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Role check
  if (sender.role === receiver.role) {
    const oppositeRole = sender.role === "MENTOR" ? "mentee" : "mentor";
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can only connect with ${oppositeRole}s`,
    );
  }

  // Check if already connected
  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { user1Id: senderId, user2Id: receiverId },
        { user1Id: receiverId, user2Id: senderId },
      ],
    },
  });

  if (existingConnection) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already connected");
  }

  // Check for pending request
  const existingRequest = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId, status: RequestStatus.PENDING },
        {
          senderId: receiverId,
          receiverId: senderId,
          status: RequestStatus.PENDING,
        },
      ],
    },
  });

  if (existingRequest) {
    const isSentByMe = existingRequest.senderId === senderId;
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      isSentByMe
        ? "Request already sent"
        : "You have a pending request from this user",
    );
  }

  // Create request
  const request = await prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId,
      message,
    },
    include: {
      sender: {
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          profile: { select: { profileImage: true, profession: true } },
        },
      },
      receiver: {
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          profile: { select: { profileImage: true, profession: true } },
        },
      },
    },
  });

  return request;
};

// Get pending requests
const getPendingRequests = async (userId: string, query: PaginationInput) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ConnectionRequestWhereInput = {
    OR: [
      { senderId: userId, status: RequestStatus.PENDING },
      { receiverId: userId, status: RequestStatus.PENDING },
    ],
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
                availability: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
                availability: true,
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

  const formattedRequests = requests.map((request) => ({
    ...request,
    isSentByMe: request.senderId === userId,
    otherUser: request.senderId === userId ? request.receiver : request.sender,
  }));

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: formattedRequests,
  };
};

// Update request status
const updateRequestStatus = async (
  userId: string,
  payload: UpdateRequestStatusInput,
) => {
  const { requestId, status } = payload;

  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.receiverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only the receiver can accept/reject requests",
    );
  }

  if (request.status !== RequestStatus.PENDING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already processed");
  }

  const updatedRequest = await prisma.connectionRequest.update({
    where: { id: requestId },
    data: { status },
    include: {
      sender: {
        select: {
          id: true,
          fullname: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          fullname: true,
          role: true,
        },
      },
    },
  });

  if (status === RequestStatus.ACCEPTED) {
    const [user1Id, user2Id] = [request.senderId, request.receiverId].sort();

    await prisma.connection.create({
      data: {
        user1Id,
        user2Id,
      },
    });
  }

  return updatedRequest;
};

// Get connections
const getConnections = async (userId: string, query: PaginationInput) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ConnectionWhereInput = {
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
                about: true,
                availability: true,
                interests: true,
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
                about: true,
                availability: true,
                interests: true,
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

  const formattedConnections = connections.map((connection) => ({
    id: connection.id,
    otherUser:
      connection.user1Id === userId ? connection.user2 : connection.user1,
    connectedSince: connection.createdAt,
  }));

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: formattedConnections,
  };
};

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
      "Can only remove your own connections",
    );
  }

  await prisma.connection.delete({
    where: { id: connectionId },
  });

  return { success: true };
};

// Get network stats
const getNetworkStats = async (userId: string) => {
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
          status: RequestStatus.PENDING,
        },
      }),
      prisma.connectionRequest.count({
        where: {
          receiverId: userId,
          status: RequestStatus.PENDING,
        },
      }),
    ]);

  return {
    connections: connectionsCount,
    pendingSent: sentRequestsCount,
    pendingReceived: receivedRequestsCount,
    totalPending: sentRequestsCount + receivedRequestsCount,
  };
};

export const networkService = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  updateRequestStatus,
  getConnections,
  removeConnection,
  getNetworkStats,
};
```
