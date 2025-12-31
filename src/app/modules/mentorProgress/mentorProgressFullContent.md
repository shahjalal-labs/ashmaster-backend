# mentorProgressFullContent.md

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
│   │   │   │   ├── ChecklistEndGoalFullContent.md
│   │   │   │   ├── checklistEndGoal.routes.ts
│   │   │   │   ├── checklistEndGoal.service.ts
│   │   │   │   ├── checklistEndGoal.validation.ts
│   │   │   │   └── mentoProgress.ts
│   │   │   ├── mentorProgress
│   │   │   │   ├── mentorProgress.api.hurl
│   │   │   │   ├── mentorProgress.controller.ts
│   │   │   │   ├── mentorProgress.routes.ts
│   │   │   │   ├── mentorProgress.service.ts
│   │   │   │   └── mentorProgress.validation.ts
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

27 directories, 91 files
```

## 📁 mentorProgress Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/mentorProgress
├── mentorProgress.api.hurl
├── mentorProgress.controller.ts
├── mentorProgress.routes.ts
├── mentorProgress.service.ts
└── mentorProgress.validation.ts

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
  id               String             @id @default(auto()) @map("_id") @db.ObjectId
  email            String             @unique
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
  viewedMentees    MentorMenteeView[] @relation("MentorViews")
  viewedByMentors  MentorMenteeView[] @relation("MenteeViews")

  @@map("users")
}

//w: (end)  ╰────────────  User  ────────────╯

//w: (start)╭────────────  MentorMenteeView ────────────╮
model MentorMenteeView {
  id       String   @id @default(auto()) @map("_id") @db.ObjectId
  mentorId String   @db.ObjectId
  menteeId String   @db.ObjectId
  viewedAt DateTime @default(now())
  mentor   User     @relation("MentorViews", fields: [mentorId], references: [id], onDelete: Cascade)
  mentee   User     @relation("MenteeViews", fields: [menteeId], references: [id], onDelete: Cascade)

  @@unique([mentorId, menteeId])
  @@index([mentorId, viewedAt])
  @@map("mentor_mentee_views")
}

//w: (end)  ╰────────────  MentorMenteeView ────────────╯

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

## 📝 mentorProgress.validation.ts

```ts

```

## 🛠️ mentorProgress.service.ts

```ts
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../shared/paginationHelper";
import { Prisma } from "@prisma/client";

//w: (start)╭──────────── mentorChecklistView ────────────╮
const mentorChecklistView = async (userId: string) => {
  const mentor = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!mentor || !(mentor.role === "MENTOR")) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only mentor can view this");
  }

  const connections = await prisma.connections.findMany({
    where: {
      OR: [
        {
          receiverId: userId,
          status: "ACCEPTED",
        },
        {
          senderId: userId,
          status: "ACCEPTED",
        },
      ],
    },
    select: {
      id: true,
      sender: {
        select: {
          id: true,
        },
      },
      receiver: {
        select: {
          id: true,
        },
      },
    },
  });

  const connectedMenteeIds = [
    //w: ...new Set makes the array unique if anyway create's any duplicacy. Though no duplicacy will come still for better backend safety
    ...new Set(
      connections
        .flatMap((c) => [c.sender.id, c.receiver.id])
        .filter((id) => id !== userId),
    ),
  ];

  const menteesWithChecklist = await prisma.user.findMany({
    where: {
      id: {
        in: connectedMenteeIds,
      },
      role: "MENTEE",
      checklistEndGoal: {
        some: {
          type: "CHECKLIST",
        },
      },
    },
  });
  return menteesWithChecklist;
};

//w: (end)  ╰──────────── mentorChecklistView ────────────╯

//w: (start)╭──────────── viewSpeficMenteeChecklists ────────────╮
const viewSpeficMenteeChecklists = async (
  mentorId: string,
  menteeId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" },
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId: menteeId,
    ...(filter.type && { type: filter.type }),
  };

  const [data, total] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      /* include: {
        user: {
          select: {
            fullname: true,
            id: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      }, */
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

  if (filter?.type === "CHECKLIST") {
    await prisma.mentorMenteeView.upsert({
      where: {
        mentorId_menteeId: {
          mentorId,
          menteeId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        mentorId,
        menteeId,
      },
    });
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};
//w: (end)  ╰──────────── viewSpeficMenteeChecklists ────────────╯

export const MentorProgressService = {
  mentorChecklistView,
  viewSpeficMenteeChecklists,
};
```

## 🎮 mentorProgress.controller.ts

```ts
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MentorProgressService } from "./mentorProgress.service";
import { paginationOptions } from "../../../shared/paginationHelper";
import { pick } from "../../../shared/pick";

//w: (start)╭──────────── mentorChecklistView ────────────╮
const mentorChecklistView = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await MentorProgressService.mentorChecklistView(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched Successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── mentorChecklistView ────────────╯

//w: (start)╭──────────── viewSpeficMenteeChecklists ────────────╮
const viewSpeficMenteeChecklists = catchAsync(async (req, res) => {
  const pickedPagination = pick(req.query, paginationOptions);

  const pickedFilter = pick(req.query, ["type"]);
  const { id: menteeId } = req.params;
  const { id: mentorId } = req.user;

  const result = await MentorProgressService.viewSpeficMenteeChecklists(
    mentorId,
    menteeId,
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
//w: (end)  ╰──────────── viewSpeficMenteeChecklists ────────────╯

export const MentorProgressController = {
  mentorChecklistView,
  viewSpeficMenteeChecklists,
};
```

## 🔧 mentorProgress.routes.ts

```ts
import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import { MentorProgressController } from "./mentorProgress.controller";

const router = Router();

router.use(auth());
// router.use(mentorGuard);

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.get("/checklist-view", MentorProgressController.mentorChecklistView);

router.get("/:id", MentorProgressController.viewSpeficMenteeChecklists);

export const MentorProgressRoutes = router;
```

## 🧪 mentorProgress.api.hurl

```bash
# fetch mentor checklist view
GET {{port6011}}/mentor-progress/checklist-view
Authorization: {{ashRaisa}}


# view specific mentee checklists
GET {{port6011}}/mentor-progress/694a39873340ac9b4e138239?type=CHECKLIST&page=1&limit=100
Authorization: {{ashRaisa}}

```

how can i give a field for mentorChecklistView so that it can be understood is it viewed or not.
