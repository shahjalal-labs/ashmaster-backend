# ChecklistEndGoalFullContent.md

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
│   │   │   ├── ChecklistEndGoal
│   │   │   │   ├── checklistEndGoal.api.hurl
│   │   │   │   ├── checklistEndGoal.controller.ts
│   │   │   │   ├── checklistEndGoal.routes.ts
│   │   │   │   ├── checklistEndGoal.service.ts
│   │   │   │   └── checklistEndGoal.validation.ts
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

26 directories, 84 files
```

## 📁 ChecklistEndGoal Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/ChecklistEndGoal
├── checklistEndGoal.api.hurl
├── checklistEndGoal.controller.ts
├── checklistEndGoal.routes.ts
├── checklistEndGoal.service.ts
└── checklistEndGoal.validation.ts

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
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String @unique

  password         String?
  fullname         String
  fcmToken         String?
  role             UserRole           @default(MENTEE)
  profilStatus     ProfilStatus       @default(INCOMPLETE)
  profile          Profile?
  preference       Preference?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  sentRequests     Connections[]      @relation("SentRequests")
  receivedRequests Connections[]      @relation("ReceivedRequests")
  checklistEndGoal ChecklistEndGoal[]

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
  @@index([createdAt])
  @@map("connections")
}

//w: (end)  ╰────────────  Connections ────────────╯

//w: (start)╭────────────  ChecklistEndGoal ────────────╮
model ChecklistEndGoal {
  id          String               @id @default(auto()) @map("_id") @db.ObjectId
  type        ChecklistEndGoalType
  userId      String               @db.ObjectId
  user        User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  status      Status               @default(INCOMPLETE)
  title       String
  description String
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  @@index([createdAt])
  @@map("checklist_end_goals")
}

//w: (end)  ╰────────────  ChecklistEndGoal ────────────╯

enum ChecklistEndGoalType {
  CHECKLIST
  ENDGOALS
}

enum Status {
  COMPLETE
  INCOMPLETE
}

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

## 🎮 checklistEndGoal.controller.ts

```ts
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ChecklistEndGoalsService } from "./checklistEndGoal.service";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoals = catchAsync(async (req, res) => {
  const { id } = req.user;
  await ChecklistEndGoalsService.createChecklistEndGoals(id, req.body);

  const { type } = req.body;
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${type} created successfully`,
    data: null,
  });
});
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── getAllChecklistOrEndGoals ────────────╮
const getAllChecklistOrEndGoals = catchAsync(async (req, res) => {
  const pickedPagination = pick(req.query, paginationOptions);

  const pickedFilter = pick(req.query, ["type"]);
  const { id } = req.params;
  const result = await ChecklistEndGoalsService.getAllChecklistOrEndGoals(
    id,
    pickedPagination,
    pickedFilter,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ` fetched successfully`,
    data: result,
  });
});
//w: (end)  ╰──────────── getAllChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── updateChecklistEndGoals ────────────╮
const updateChecklistEndGoals = catchAsync(async (req, res) => {
  const { id } = req.user;

  await ChecklistEndGoalsService.updateChecklistEndGoals(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Checklist updated successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── updateChecklistEndGoals ────────────╯

//w: (start)╭──────────── deleteChecklistEndGoals ────────────╮
const deleteChecklistEndGoals = catchAsync(async (req, res) => {
  const { id } = req.user;

  const checklistEndGoalsId = req.params.id;
  await ChecklistEndGoalsService.deleteChecklistEndGoals(
    id,
    checklistEndGoalsId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "End goals / checklist deleted successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── deleteChecklistEndGoals ────────────╯

export const ChecklistEndGoalsController = {
  createChecklistEndGoals,
  getAllChecklistOrEndGoals,
  updateChecklistEndGoals,
  deleteChecklistEndGoals,
};
```

## 🧪 checklistEndGoal.api.hurl

```bash
# create checklist / endgoals
POST {{port6011}}/checklist-end-goals/create
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "title":"Read 3 hours",
 "description": "Study 8 am to 11 am before going to school. And ready for submission.",
 "type": "CHECKLIST"
}

# get all checklist/ endgoals

GET  {{port6011}}/checklist-end-goals/694a254aad128cabeaf7412f?type=ENDGOALS&page=1&limit=10&sortBy=title&sortOrder=asc
#Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}





GET  {{port6011}}/checklist-end-goals?type=CHECKLIST&page=1&limit=10&sortBy=title&sortOrder=asc
Authorization: {{ashRaisa}}



# update checklist
PATCH  {{port6011}}/checklist-end-goals/status
#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}

Content-Type: application/json

{
 "checklistId": "694d1cadf2f85a0ba12ada34",
 "status": "COMPLETE",
 "title": "Read 4 h",
 "description":"Study 4h at night"
}


DELETE  {{port6011}}/checklist-end-goals/694fa0aa8a0113dcfa949157

#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}
```

## 🔧 checklistEndGoal.routes.ts

```ts
import { Router } from "express";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import config, { ENV } from "../../../config";
import { ChecklistEndGoalsController } from "./checklistEndGoal.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ChecklistEndGoalsValidation } from "./checklistEndGoal.validation";

const router = Router();

router.get("/:id", ChecklistEndGoalsController.getAllChecklistOrEndGoals);

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.post(
  "/create",
  validateRequest(ChecklistEndGoalsValidation.createChecklistEndGoalsSchema),
  ChecklistEndGoalsController.createChecklistEndGoals,
);

router.patch(
  "/status",
  validateRequest(ChecklistEndGoalsValidation.updateChecklistEndGoalsSchema),
  ChecklistEndGoalsController.updateChecklistEndGoals,
);

router.delete("/:id", ChecklistEndGoalsController.deleteChecklistEndGoals);

export const ChecklistEndGoalsRoutes = router;
```

## 📝 checklistEndGoal.validation.ts

```ts
import { ChecklistEndGoalType, Status } from "@prisma/client";
import { title } from "process";
import { z } from "zod";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoalsSchema = z
  .object({
    type: z.nativeEnum(ChecklistEndGoalType),
    title: z.string().min(4),
    description: z.string().min(10),
  })
  .strict();
export type TCreateChecklistEndGoals = z.infer<
  typeof createChecklistEndGoalsSchema
>;
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── changeChecklistStatus ────────────╮
const updateChecklistEndGoalsSchema = z
  .object({
    status: z.nativeEnum(Status),
    checklistId: z.string().min(24),
    title: z.string().min(4),
    description: z.string().min(10),
  })
  .strict();

export type TChangeChecklistStatusSchema = z.infer<
  typeof updateChecklistEndGoalsSchema
>;

//w: (end)  ╰──────────── changeChecklistStatus ────────────╯

const deleteChecklistEndGoalsSchema = z.object({});

export const ChecklistEndGoalsValidation = {
  createChecklistEndGoalsSchema,
  updateChecklistEndGoalsSchema,
  deleteChecklistEndGoalsSchema,
};
```

## 🛠️ checklistEndGoal.service.ts

```ts
import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/paginationHelper";
import {
  TChangeChecklistStatusSchema,
  TCreateChecklistEndGoals,
} from "./checklistEndGoal.validation";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoals = async (
  userId: string,
  payload: TCreateChecklistEndGoals,
) => {
  await prisma.checklistEndGoal.create({
    data: {
      userId,
      ...payload,
    },
  });

  return;
};
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── getAllChecklistOrEndGoals ────────────╮
/* const getAllChecklistOrEndGoals = async (
  userId: string,
  paginations: IPaginationOptions,
  filter: any,
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId,
    type: filter.type,
  };

  const [result, total, totalForProgress, completed] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.checklistEndGoal.count({
      where: whereClause,
    }),

    prisma.checklistEndGoal.count({
      where: {
        userId,
        type: "CHECKLIST",
      },
    }),

    prisma.checklistEndGoal.count({
      where: {
        userId,
        type: "CHECKLIST",
        status: "COMPLETE",
      },
    }),
  ]);

  console.log(`progress`, {
    totalForProgress,
    completed,
  });

  let progress;
  if (completed !== 0) {
    progress = (completed / totalForProgress).toFixed(1);
  } else {
    progress = 0;
  }

  return {
    meta: {
      progress,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };

}; */

const getAllChecklistOrEndGoals = async (
  userId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" },
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId,
    ...(filter.type && { type: filter.type }),
  };

  const [data, total] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

  let progress: number | null = null;

  if (filter.type === "CHECKLIST") {
    const [totalChecklist, completedChecklist] = await Promise.all([
      prisma.checklistEndGoal.count({
        where: { userId, type: "CHECKLIST" },
      }),
      prisma.checklistEndGoal.count({
        where: {
          userId,
          type: "CHECKLIST",
          status: "COMPLETE",
        },
      }),
    ]);

    progress =
      totalChecklist > 0
        ? Math.round((completedChecklist / totalChecklist) * 100)
        : 0;
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    progress,
    data,
  };
};

//w: (end)  ╰──────────── getAllChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── updateChecklistEndGoals ────────────╮
const updateChecklistEndGoals = async (
  userId: string,
  payload: TChangeChecklistStatusSchema,
) => {
  const checklist = await prisma.checklistEndGoal.findUnique({
    where: {
      id: payload.checklistId,
    },
  });
  if (!checklist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Checklist not found");
  }

  if (checklist?.userId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't change ohter's checklist.",
    );
  }

  await prisma.checklistEndGoal.update({
    where: {
      id: payload.checklistId,
    },
    data: {
      status: payload.status,
      description: payload.description,
      title: payload.title,
    },
  });
};
//w: (end)  ╰──────────── updateChecklistEndGoals ────────────╯

//w: (start)╭──────────── deleteChecklistEndGoals ────────────╮
const deleteChecklistEndGoals = async (
  userId: string,
  checklistEndGoalId: string,
) => {
  const checklist = await prisma.checklistEndGoal.findUnique({
    where: {
      id: checklistEndGoalId,
    },
  });
  if (!checklist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Checklist not found");
  }

  if (checklist?.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can't delete ohter's checklist or end goals.",
    );
  }

  await prisma.checklistEndGoal.delete({
    where: {
      id: checklistEndGoalId,
    },
  });
  return null;
};
//w: (end)  ╰──────────── deleteChecklistEndGoals ────────────╯

const getChecklistEndGoalById = async () => {};

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getAllChecklistOrEndGoals,
  updateChecklistEndGoals,
  deleteChecklistEndGoals,
  getChecklistEndGoalById,
};
```
