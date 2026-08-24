# networkFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/ashmaster-backend
├── bun.lock
├── ecosystem.config.js
├── http-client.env.json
├── kulala.note.md
├── msg.md
├── package.json
├── package-lock.json
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
│   │   │   │   ├── auth.api.http
│   │   │   │   ├── auth.api.hurl
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   │   └── profiledata.md
│   │   │   ├── chat
│   │   │   │   ├── chat.api.hurl
│   │   │   │   ├── chat.controller.ts
│   │   │   │   ├── chat.routes.ts
│   │   │   │   └── chat.service.ts
│   │   │   ├── ChecklistEndGoal
│   │   │   │   ├── checklistEndGoal.api.hurl
│   │   │   │   ├── checklistEndGoal.controller.ts
│   │   │   │   ├── checklistEndGoal.routes.ts
│   │   │   │   ├── checklistEndGoal.service.ts
│   │   │   │   └── checklistEndGoal.validation.ts
│   │   │   ├── Group
│   │   │   │   ├── group.api.hurl
│   │   │   │   ├── group.controller.ts
│   │   │   │   ├── group.routes.ts
│   │   │   │   ├── group.service.ts
│   │   │   │   └── group.validation.ts
│   │   │   ├── mentorProgress
│   │   │   │   ├── mentorProgress.api.http
│   │   │   │   ├── mentorProgress.api.hurl
│   │   │   │   ├── mentorProgress.controller.ts
│   │   │   │   ├── mentorProgress.routes.ts
│   │   │   │   ├── mentorProgress.service.ts
│   │   │   │   └── mentorProgress.validation.ts
│   │   │   ├── network
│   │   │   │   ├── matchsuggestionlogic.md
│   │   │   │   ├── network.api.http
│   │   │   │   ├── network.api.hurl
│   │   │   │   ├── network.controller.ts
│   │   │   │   ├── network.routes.ts
│   │   │   │   ├── network.service.ts
│   │   │   │   └── network.validation.ts
│   │   │   ├── Notification
│   │   │   │   ├── notification.api.http
│   │   │   │   ├── notification.api.hurl
│   │   │   │   ├── notification.controller.ts
│   │   │   │   ├── notification.routes.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── notification.validation.ts
│   │   │   ├── Schedule
│   │   │   │   ├── schedule.api.http
│   │   │   │   ├── schedule.api.hurl
│   │   │   │   ├── schedule.controller.ts
│   │   │   │   ├── schedule.routes.ts
│   │   │   │   ├── schedule.service.ts
│   │   │   │   └── schedule.validation.ts
│   │   │   ├── socket
│   │   │   │   ├── handlers
│   │   │   │   │   └── chat.handler.ts
│   │   │   │   ├── socket.controller.ts
│   │   │   │   ├── socket.interface.ts
│   │   │   │   ├── socket.note.md
│   │   │   │   ├── socket.service.ts
│   │   │   │   └── wstest.json
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
│   │   └── viewRoutes.ts
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
│   │   └── sendEmail.ts
│   ├── interfaces
│   │   ├── common.ts
│   │   ├── error.ts
│   │   ├── file.ts
│   │   ├── index.d.ts
│   │   └── paginations.ts
│   ├── jobs
│   │   ├── bullBoard.ts
│   │   ├── queues
│   │   │   ├── emailQueue.ts
│   │   │   └── notificationQueue.ts
│   │   └── workers
│   │       ├── emailWorker.ts
│   │       └── notificationWorker.ts
│   ├── resource
│   │   └── requirements.md
│   ├── server.ts
│   ├── shared
│   │   ├── catchAsync.ts
│   │   ├── paginationHelper.ts
│   │   ├── pick.ts
│   │   ├── prisma.ts
│   │   ├── redis-services
│   │   │   ├── chat.service.ts
│   │   │   ├── otp.service.ts
│   │   │   └── redisservice.note.md
│   │   ├── redis.ts
│   │   ├── searchFilter.ts
│   │   ├── sendResponse.ts
│   │   ├── uploadInSpace.ts
│   │   └── userSearch.ts
│   └── utils
│       └── getUserOrThrow.ts
├── structure.md
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

32 directories, 124 files
```

## 📁 network Module Tree

```bash
/home/sj/web/smt_project/ashmaster-backend/src/app/modules/network
├── matchsuggestionlogic.md
├── network.api.http
├── network.api.hurl
├── network.controller.ts
├── network.routes.ts
├── network.service.ts
└── network.validation.ts

1 directory, 7 files
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
  id                     String             @id @default(auto()) @map("_id") @db.ObjectId
  email                  String             @unique
  password               String?
  fullname               String
  fcmToken               String[]
  role                   UserRole           @default(MENTEE)
  profilStatus           ProfilStatus       @default(INCOMPLETE)
  profile                Profile?
  preference             Preference?
  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt
  sentRequests           Connections[]      @relation("SentRequests")
  receivedRequests       Connections[]      @relation("ReceivedRequests")
  checklistEndGoal       ChecklistEndGoal[]
  viewedMentees          MentorMenteeView[] @relation("MentorViews")
  viewedByMentors        MentorMenteeView[] @relation("MenteeViews")
  checklistUpdateTracker DateTime?
  schedule               Schedule[]
  message                Message[]
  receivedNotifications  Notification[]     @relation("notificationRecieve")
  sentNotifications      Notification[]     @relation("notificationSend")

  @@map("users")
}

//w: (end)  ╰────────────  User  ────────────╯

//w: (start)╭────────────  Schedule ────────────╮
model Schedule {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  dateTime    DateTime
  title       String
  description String
  hostId      String   @db.ObjectId
  host        User     @relation(fields: [hostId], references: [id])
  guestIds    String[] @db.ObjectId
  images      String[] @default([]) // host or guest embeded images for faster query no complex model required

  @@unique([dateTime, hostId])
  @@index([dateTime])
  @@map("schedules")
}

//w: (end)  ╰────────────  Schedule ────────────╯

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
  profileImage   String   @default("https://i.ibb.co.com/nrs3FjM/images.png")
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
  @@index([type])
  @@map("checklist_end_goals")
}

//w: (end)  ╰────────────  ChecklistEndGoal ────────────╯

//w: (start)╭────────────  Group ────────────╮
model Group {
  id         String     @id @default(auto()) @map("_id") @db.ObjectId
  title      String
  memberIds  String[]
  groupPhoto String?
  creatorId  String     @db.ObjectId
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  chatRoom   ChatRoom[]
}

//w: (end)  ╰──────────── Group  ────────────╯

//w: (start)╭────────────  ChatRoom ────────────╮
model ChatRoom {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  type         RoomType
  groupId      String?   @db.ObjectId
  group        Group?    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  participants String[]  @db.ObjectId // both P2P and group
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  messages     Message[]

  @@map("chatrooms")
}

//w: (end)  ╰──────────── ChatRoom  ────────────╯

//w: (start)╭────────────  Message ────────────╮
model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  roomId    String   @db.ObjectId
  senderId  String   @db.ObjectId
  content   String?
  fileUrl   String[]
  readBy    String[] @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  sender User     @relation(fields: [senderId], references: [id], onDelete: Cascade)
}

//w: (end)  ╰────────────  Message ────────────╯

//w: (start)╭────────────  Notification  ────────────╮
model Notification {
  id                  String              @id @default(auto()) @map("_id") @db.ObjectId
  title               String
  body                String?
  receiverId          String              @db.ObjectId
  receiver            User                @relation("notificationRecieve", fields: [receiverId], references: [id])
  senderId            String?             @db.ObjectId
  sender              User?               @relation("notificationSend", fields: [senderId], references: [id])
  type                NotificationType
  isRead              Boolean             @default(false)
  notificationChannel NotificationChannel @default(BOTH)
  metaData            Json?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  @@index([isRead])
  @@map("notifications")
}

//w: (end)  ╰────────────  Notification  ────────────╯

enum NotificationChannel {
  INAPP
  PUSH
  BOTH
}

enum NotificationType {
  CHAT
  CONNECTIONS
  SCHEDULE
  GROUP
  CHECKLISTENDGOAL
  SYSTEM
}

enum RoomType {
  P2P
  GROUP
}

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
  "name": "ashmaster-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "concurrently \"tsx watch src/server.ts\" \"tsx watch src/jobs/workers/emailWorker.ts\" \"tsx watch src/jobs/workers/notificationWorker.ts\"",
    "build": "tsc",
    "postinstall": "prisma db push && prisma generate "
  },
  "keywords": [],
  "author": "Md. Shahjalal",
  "license": "ISC",
  "description": "ashmaster-backend",
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
    "tsx": "^4.21.0",
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
    "concurrently": "^9.2.1",
    "cors": "^2.8.5",
    "date-fns": "^4.1.0",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-basic-auth": "^1.2.1",
    "firebase-admin": "^13.2.0",
    "helmet": "^8.1.0",
    "http-status": "^1.7.4",
    "ioredis": "^5.8.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.16",
    "nodemon": "^3.1.4",
    "uuid": "^13.0.0",
    "ws": "^8.19.0",
    "zod": "^3.23.8"
  }
}
```

## 🛠️ network.service.ts

```ts
import prisma from "../../../shared/prisma";
import { Prisma, ProfilStatus, UserRole } from "@prisma/client";

import { paginationHelper, TOptions } from "../../../shared/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TResponseRequest, TSendConnectionReqest } from "./network.validation";
import { notificationQueue } from "../../../jobs/queues/notificationQueue";

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

  const [suggestedUsers, total] = await Promise.all([
    await prisma.user.findMany({
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
    }),

    await prisma.user.count({
      where: whereClause,
    }),
  ]);

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
        fullname: true,
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

  const connection = await prisma.connections.create({
    data: {
      senderId: userId,
      receiverId,
      uniqueKey,
      message,
    },
  });

  // notify the other user
  await notificationQueue.add(
    "newConnection",
    {
      receiverId,
      userId,
      fullname: user.fullname,
      requestId: connection.id,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 3600 * 2, //2h
      },
    },
  );

  //notify other user without bullmq
  /* await sendSingleNotification(
    receiverId,
    "New connection request",
    `${user.fullname} has sent you a connection request`,
    "CONNECTIONS",
    "BOTH",
    userId, // senderId
    {
      requestId: connection.id,
    },
  ); */
};

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequest ────────────╮
const getPendingRequest = async (userId: string, options: TOptions) => {
  const { page, skip, limit } = paginationHelper.calcalutePagination(options);

  const whereClause: Prisma.ConnectionsWhereInput = {
    receiverId: userId,
    status: "PENDING",
  };

  const [requests, total] = await Promise.all([
    prisma.connections.findMany({
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
    }),

    prisma.connections.count({
      where: whereClause,
    }),
  ]);

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

//w: (start)╭──────────── getConnections ────────────╮
const getConnections = async (userId: string, options: TOptions) => {
  const { page, skip, limit } = paginationHelper.calcalutePagination(options);

  const whereClause: Prisma.ConnectionsWhereInput = {
    status: "ACCEPTED",
    OR: [
      {
        senderId: userId,
      },
      {
        receiverId: userId,
      },
    ],
  };
  const [connections, total] = await Promise.all([
    prisma.connections.findMany({
      where: whereClause,
      select: {
        id: true,
        receiver: {
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
        // same as createdAt:"desc" but for indexed faster query
        id: "desc",
      },
    }),

    prisma.connections.count({
      where: whereClause,
    }),
  ]);

  //  finding opposite user for front end. creating shape like this as front end already created model. for similarity backend used this pattern
  const renderIntoUiConnections = connections.map((c) => {
    const connected: any = {
      id: "",
      sender: {
        profile: {},
      },
    };
    if (c.sender.id !== userId) {
      connected.id = c.id;
      connected.sender.id = c.sender.id;
      connected.sender.fullname = c.sender.fullname;
      connected.sender.profile.profileImage = c.sender.profile?.profileImage;
      connected.sender.profile.profession = c.sender.profile?.profession;
    } else {
      connected.id = c.id;
      connected.sender.id = c.receiver.id;
      connected.sender.fullname = c.receiver.fullname;
      connected.sender.profile.profileImage = c.receiver.profile?.profileImage;
      connected.sender.profile.profession = c.receiver.profile?.profession;
    }
    return connected;
  });

  return {
    meta: {
      total,
      skip,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: renderIntoUiConnections,
  };
};
//w: (end)  ╰──────────── getConnections ────────────╯

//w: (start)╭──────────── responseRequestOrRemoveConnection ────────────╮
const responseRequestOrRemoveConnection = async (
  userId: string,
  payload: TResponseRequest,
) => {
  //  paylaod status:
  //  ACCEPTED/ REJECTED/REMOVE   // accpet/reject to response the request & remove for deletng existing connection

  const [request] = await Promise.all([
    await prisma.connections.findUnique({
      where: {
        id: payload.requestId,
      },
      select: {
        id: true,
        status: true,
        senderId: true,
        receiverId: true,
        receiver: {
          select: {
            fullname: true,
          },
        },
      },
    }),
  ]);

  if (!request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No request found");
  }

  if (request?.receiverId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You canno't response to other request",
    );
  }

  // if already accepted then throw error when tyring not to remove connection
  //p: ACCEPTED/ REJECTED/REMOVE   // accpet/reject to response the request & remove to delete existing connection or cancel sent request

  if (payload.status !== "REMOVE" && request.status === "ACCEPTED") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already responded");
  }

  if (payload.status === "ACCEPTED") {
    await prisma.connections.update({
      where: {
        id: payload.requestId,
      },
      data: {
        status: payload.status,
      },
    });

    // connectionRequest acceptance notif
    await notificationQueue.add(
      "requestAcceptance",
      {
        senderId: request.senderId,
        fullname: request.receiver.fullname,
        receiverId: request.receiverId, // notification senderid
        requestId: request.id,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          age: 3600 * 2, //2h
        },
      },
    );

    // notify the other user
    /* await sendSingleNotification(
      request.senderId, // notification receiverId
      "Connection request accepted",
      `${request.receiver.fullname} accepted your connection request`,
      "CONNECTIONS",
      "BOTH",
      request.receiverId, // notification senderid
      {
        requestId: request.id,
      },
    ); */
  } else {
    await prisma.connections.delete({
      where: {
        id: payload.requestId,
      },
    });
  }
};
//w: (end)  ╰──────────── responseRequestOrRemoveConnection ────────────╯

//w: (start)╭──────────── getMyConnectionCount ────────────╮
const getMyConnectionCount = async (userId: string) => {
  const connectionsCount = await prisma.connections.count({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          receiverId: userId,
        },
        {
          senderId: userId,
        },
      ],
    },
  });
  console.log(connectionsCount, "network.service.ts", 395);
  return {
    connectionsCount,
  };
};
//w: (end)  ╰──────────── getMyConnectionCount ────────────╯

export const NetworkService = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequest,
  getConnections,
  responseRequestOrRemoveConnection,
  getMyConnectionCount,
};
```

## 📖 matchsuggestionlogic.md

```markdown
## connection suggestion logic

1. exact match needed (we using AND operator)
2. excluding own profile
3. excluding those are already connected
4. excluding those are already pending (from both side, sender or reciever)
5. match based on interests, checking logged in user interest with other user interest through in operator,
6. match with the preference settings, where array using in operator
7. availability with in operator meaning any slot if matches then get result. if availability doesn't match with anyone still get in suggestions but who matches availability come first in order.
```

## 🎮 network.controller.ts

```ts
import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";
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

//w: (start)╭──────────── getConnections ────────────╮
const getConnections = catchAsync(async (req, res) => {
  const id = req.user.id;
  const options = pick(req.query, paginationOptions);

  const result = await NetworkService.getConnections(id, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Connections fetched successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getConnections ────────────╯

//w: (start)╭──────────── responseRequestOrRemoveConnection ────────────╮
const responseRequestOrRemoveConnection = catchAsync(async (req, res) => {
  const { id } = req.user;
  await NetworkService.responseRequestOrRemoveConnection(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request responsed successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── responseRequestOrRemoveConnection ────────────╯

//w: (start)╭──────────── getMyConnectionCount ────────────╮
const getMyConnectionCount = catchAsync(async (req, res) => {
  const { id: userId } = req.user;

  const result = await NetworkService.getMyConnectionCount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched my connections count successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── getMyConnectionCount ────────────╯

export const NetworkController = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  getConnections,
  responseRequestOrRemoveConnection,
  getMyConnectionCount,
};
```

## 🔧 network.routes.ts

```ts
import express from "express";
import { NetworkController } from "./network.controller";
import auth from "../../middlewares/auth";
import { profileGuard } from "../../middlewares/profile";
import validateRequest from "../../middlewares/validateRequest";
import { NetworkValidation } from "./network.validation";
import config, { ENV } from "../../../config";

const router = express.Router();

router.use(auth());
if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}
// Get suggestions (for home page)
//w: (start)╭──────────── getSuggestions ────────────╮
router.get("/suggestions", NetworkController.getSuggestions);
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

router.get("/connections", NetworkController.getConnections);

router.patch(
  "/response-or-remove",
  validateRequest(NetworkValidation.responseRequestOrRemoveConnection),
  NetworkController.responseRequestOrRemoveConnection,
);

router.get("/connections-count", NetworkController.getMyConnectionCount);

export const NetworkRoutes = router;
```

## 🧪 network.api.hurl

```bash
# Simple Network Tests

# Get suggestions
GET {{port6011}}/network/suggestions?page=1&limit=10
#Authorization: {{ashsrahim}}
#Authorization: {{ashsrasu}}
Authorization: {{ashRaisa}}

# Send request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
#Authorization: {{ashsrasu}}
#Authorization: {{ashsrahim}}
Content-Type: application/json

{
  "receiverId": "694a793d6f65b4f863400d6a",
  "message": "Hi, let's connect! I have dream to become a software engineer. I want to know many things from you."
}


# Get pending requests
GET {{port6011}}/network/request-pending?page=1&limit=10
#Authorization: {{ashsrahim}}
Authorization: {{ashsrasu}}
#Authorization: {{ashRaisa}}


# response/remove connection  or cancel sent connection request 

PATCH {{port6011}}/network/response-or-remove

#Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}
Authorization: {{ashsrasu}}

Content-Type: application/json

{
  "requestId": "697887bbb92c730c8e2d95ca",
  "status": "ACCEPTED"
}     #/ ACCEPTED/ REJECTED/REMOVE   // accpet/reject to response the request & remove to delete existing connection or cancel send request


# get connections

GET {{port6011}}/network/connections?page=1&limit=10
Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}



# get my connections count

GET {{port6011}}/network/connections-count
#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}


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

//w: (start)╭──────────── responseRequest ────────────╮
const responseRequestOrRemoveConnection = z
  .object({
    requestId: z.string().min(24),
    status: z.enum(["ACCEPTED", "REJECTED", "REMOVE"]),
  })
  .strict();

export type TResponseRequest = z.infer<
  typeof responseRequestOrRemoveConnection
>;

//w: (end)  ╰──────────── responseRequest ────────────╯

export const NetworkValidation = {
  sendConnectionRequest,
  responseRequestOrRemoveConnection,
};
```
