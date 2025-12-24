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
│   ├── shared
│   │   ├── catchAsync.ts
│   │   ├── paginationHelper.ts
│   │   ├── pick.ts
│   │   ├── prisma.ts
│   │   ├── redis-services
│   │   │   └── otp.service.ts
│   │   ├── redis.ts
│   │   ├── searchFilter.ts
│   │   ├── sendResponse.ts
│   │   ├── uploadInSpace.ts
│   │   └── userSearch.ts
│   └── utils
│       └── getUserOrThrow.ts
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

25 directories, 77 files
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
  id               String        @id @default(auto()) @map("_id") @db.ObjectId
  email            String        @unique
  password         String?
  fullname         String
  fcmToken         String?
  role             UserRole      @default(MENTEE)
  profilStatus     ProfilStatus  @default(INCOMPLETE)
  profile          Profile?
  preference       Preference?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  sentRequests     Connections[] @relation("SentRequests")
  receivedRequests Connections[] @relation("ReceivedRequests")

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
  id          String             @id @default(auto()) @map("_id") @db.ObjectId
  careers     String[]
  genders     PreferenceGender[]
  ethnicities String[]
  notes       String?
  age         AgeRange
  userId      String             @unique @db.ObjectId
  user        User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
}

//w: (end)  ╰──────────── Preference   ────────────╯

//w: (start)╭────────────  Connections ────────────╮
model Connections {
  id         String        @id @default(auto()) @map("_id") @db.ObjectId
  senderId   String        @db.ObjectId
  sender     User          @relation("SentRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String        @db.ObjectId
  receiver   User          @relation("ReceivedRequests", fields: [receiverId], references: [id], onDelete: Cascade)
  status     RequestStatus @default(PENDING)
  uniqueKey  String        @unique
  message    String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  @@index([senderId, status])
  @@index([receiverId, status])
  @@map("connections")
}

//w: (end)  ╰────────────  Connections ────────────╯

enum RequestStatus {
  PENDING
  ACCEPTED
  // REJECTED
}

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
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import {
  paginationOptions,
  paginationOptions,
} from "../../../shared/paginationHelper";
import { NetworkService } from "./network.service";

// Get network suggestions
//w: (start)╭──────────── getSuggestions ────────────╮
const getSuggestions = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const options = pick(req.query, paginationOptions);

  const result = await NetworkService.getSuggestions(id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Suggestions retrieved successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── sendConnectionRequest ────────────╮
const sendConnectionRequest = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await NetworkService.sendConnectionRequest(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Connection request sent successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequests ────────────╮
const getPendingRequests = catchAsync(async (req, res) => {
  const id = req.user.id;
  const options = pick(req.query, paginationOptions);

  const result = await NetworkService.getPendingRequest(id, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending request fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getPendingRequests ────────────╯

export const NetworkController = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
};
```

## 📝 network.validation.ts

```ts
import { z } from "zod";

//w: (start)╭──────────── sendConnectionRequest ────────────╮
const sendConnectionRequest = z
  .object({
    receiverId: z.string().min(24),
    message: z.string().min(3).optional(),
  })
  .strict();

export type TSendConnectionReqest = z.infer<typeof sendConnectionRequest>;

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

export const NetworkValidation = {
  sendConnectionRequest,
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
import { NetworkController } from "./network.controller";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import validateRequest from "../../middlewares/validateRequest";
import { NetworkValidation } from "./network.validation";

const router = express.Router();

router.use(auth(), profileGuard());
// Get suggestions (for home page)
//w: (start)╭──────────── getSuggestions ────────────╮
router.get(
  "/suggestions",
  // auth(),
  // profileGuard(),
  NetworkController.getSuggestions,
);
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── sendConnectionRequest ────────────╮
router.post(
  "/request",
  validateRequest(NetworkValidation.sendConnectionRequest),
  NetworkController.sendConnectionRequest,
);
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequests ────────────╮
router.get("/request-pending", NetworkController.getPendingRequests);

//w: (end)  ╰──────────── getPendingRequests ────────────╯

export const NetworkRoutes = router;
```

## 🧪 network.api.hurl

```bash
# Simple Network Tests

# Get suggestions
GET {{port6011}}/network/suggestions?page=1&limit=10
Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}

# Send request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}
Content-Type: application/json

{
  "receiverId": "694a254aad128cabeaf7412f",
  "message": "Hi, let's connect! I have dream to help other"
}


# Get pending requests
GET {{port6011}}/network/request-pending?page=1&limit=10
 Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}


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
import { Prisma, ProfilStatus, RequestStatus, UserRole } from "@prisma/client";

import { paginationHelper, TOptions } from "../../../shared/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TSendConnectionReqest } from "./network.validation";
import { findOrThrow } from "../../../utils/getUserOrThrow";

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

  const connectedOrPendingUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          receivedRequests: {
            some: {
              senderId: userId,
            },
          },
        },
        {
          sentRequests: {
            some: {
              receiverId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const excludedIds = connectedOrPendingUsers.map((u) => u.id);
  // excludedIds.push(userId);
  console.log(excludedIds, "network.service.ts", 47);
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
      notIn: excludedIds,
    },

    profilStatus: ProfilStatus.COMPLETE,
    role: {
      // mentee will get mentor and mentor will get mentee only, no need to see admin > it also hide own profile as role needs to be opposite
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
    where: whereClause,
    select: {
      id: true,
      fullname: true,
      profile: {
        select: {
          profileImage: true,
          profession: true,
        },
      },
      // preference: true,
    },

    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
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

//w: (start)╭──────────── sendConnectionRequest ────────────╮
const sendConnectionRequest = async (
  userId: string,
  paylaod: TSendConnectionReqest,
) => {
  const { receiverId, message } = paylaod;
  if (userId === receiverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot send a connection request to yourself.",
    );
  }

  const uniqueKey = [userId, receiverId].sort().join("_");

  const [user, receiver, existingConnection] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
      },
    }),

    prisma.connections.findUnique({
      where: {
        uniqueKey,
      },
      select: {
        id: true,
        status: true,
      },
    }),
  ]);

  if (!user || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User or receiver not found.");
  }

  if (existingConnection) {
    const statusErrorMap = {
      PENDING: "Connection request already sent.",
      ACCEPTED: "You are already connected.",
      // REJECTED: "Connection request was rejected and cannot be resent.",
    } as const;

    throw new ApiError(
      httpStatus.BAD_REQUEST,
      statusErrorMap[existingConnection.status],
    );
  }

  await prisma.connections.create({
    data: {
      senderId: userId,
      receiverId,
      uniqueKey,
      message,
    },
  });
};

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequest ────────────╮
const getPendingRequest = async (userId: string, options: TOptions) => {
  await findOrThrow(userId);
  const { page, skip, limit } = paginationHelper.calcalutePagination(options);

  const whereClause: Prisma.ConnectionsWhereInput = {
    receiverId: userId,
    status: "PENDING",
  };
  const requests = await prisma.connections.findMany({
    where: whereClause,
    select: {
      id: true,
      sender: {
        select: {
          id: true,
          fullname: true,
          profile: {
            select: {
              profileImage: true,
              profession: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.connections.count({
    where: whereClause,
  });
  return {
    meta: {
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    },
    data: requests,
  };
};
//w: (end)  ╰──────────── getPendingRequest ────────────╯

export const NetworkService = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequest,
};
```
