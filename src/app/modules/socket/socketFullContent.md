# socketFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/ashmaster_backend
├── bun.lock
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
│   │   │   │   ├── auth.api.hurl
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── authFullContent.md
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
│   │   │   │   ├── ChecklistEndGoalFullContent.md
│   │   │   │   ├── checklistEndGoal.routes.ts
│   │   │   │   ├── checklistEndGoal.service.ts
│   │   │   │   ├── checklistEndGoal.validation.ts
│   │   │   │   └── mentoProgress.ts
│   │   │   ├── Group
│   │   │   │   ├── group.api.hurl
│   │   │   │   ├── group.controller.ts
│   │   │   │   ├── GroupFullContent.md
│   │   │   │   ├── group.routes.ts
│   │   │   │   ├── group.service.ts
│   │   │   │   └── group.validation.ts
│   │   │   ├── mentorProgress
│   │   │   │   ├── mentorProgress.api.hurl
│   │   │   │   ├── mentorProgress.controller.ts
│   │   │   │   ├── mentorProgressFullContent.md
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
│   │   │   ├── Schedule
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
│   │   │   │   ├── websocketSendResponse.ts
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
│   │   │   └── emailQueue.ts
│   │   └── workers
│   │       └── emailWorker.ts
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
│   │   │   └── otp.service.ts
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

31 directories, 115 files
```

## 📁 socket Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/socket
├── handlers
│   └── chat.handler.ts
├── socket.controller.ts
├── socket.interface.ts
├── socket.note.md
├── socket.service.ts
├── websocketSendResponse.ts
└── wstest.json

2 directories, 7 files
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
  fcmToken               String?
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

model ChatRoom {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  type         RoomType
  groupId      String?   @db.ObjectId
  group        Group?    @relation(fields: [groupId], references: [id])
  participants String[]  @db.ObjectId // both P2P and group
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  messages     Message[]

  @@map("chatrooms")
}

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
  "name": "hannanavtor-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "concurrently \"node ./dist/server.js\" \"node ./dist/workers/emailWorker.js\"",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "concurrently \"tsx watch src/server.ts\" \"tsx watch src/jobs/workers/emailWorker.ts\"",
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
    "stripe": "^18.0.0",
    "uuid": "^13.0.0",
    "ws": "^8.19.0",
    "zod": "^3.23.8"
  }
}
```

## 📦 wstest.json

```javascripton
{
  "type": "group-message",
  "groupId": "69688cf384544dd7cf4441a1",
  "content": "Hello every one!!, are you ready for the mentoring session",
  "fileUrl": [
    "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1768019205514-v4ull7jpu0e.png",
    "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1768019205514-v4ull7jpu0e.png"
  ]
}

{
  "type":"member-subscribe",
  "receiverId":"694a793d6f65b4f863400d6a"
}


  when user disconnected through network issue or sudden server close, and rerun but the user not still connected, still it's giving connected, again when member subscribe, or new message coming it's giving update conversation but not giving the updated rooms, and when  new message it's sending also sender new message come event, what's going not sure, 
```

## 📄 handlers/chat.handler.ts

```ts
import httpStatus from "http-status";
import ApiError from "../../../../errors/ApiErrors";
import prisma from "../../../../shared/prisma";
import {
  chatRedisService,
  IMessage,
} from "../../../../shared/redis-services/chat.service";
import { v4 as uuidv4 } from "uuid";

// Get user details for message sender
export const getUserDetails = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullname: true,
      profile: {
        select: {
          profileImage: true,
        },
      },
    },
  });
};

// Find or create P2P room
export const findOrCreateP2PRoom = async (
  userId: string,
  receiverId: string,
) => {
  try {
    if (userId === receiverId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You can't chat with yourself",
      );
    }

    // Verify both users exist
    const [user, receiver] = await Promise.all([
      getUserDetails(userId),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!user || !receiver) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Find existing P2P room
    let room = await prisma.chatRoom.findFirst({
      where: {
        type: "P2P",
        participants: { hasEvery: [userId, receiverId] },
      },
      include: {
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                fullname: true,
                profile: {
                  select: {
                    profileImage: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    let isNewRoom = false;

    // Create room if doesn't exist
    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          type: "P2P",
          participants: [userId, receiverId],
        },
        include: {
          messages: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              sender: {
                select: {
                  id: true,
                  fullname: true,
                  profile: {
                    select: {
                      profileImage: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
      isNewRoom = true;
    }

    // Get initial messages from Redis (latest 20)
    const initialMessages = await chatRedisService.getMessages(room.id, 20);

    // Get partner details
    const partnerId = room.participants.find((id) => id !== userId);
    const partner = partnerId ? await getUserDetails(partnerId) : null;

    return {
      room,
      isNewRoom,
      initialMessages: initialMessages.reverse(), // Oldest to newest
      partner,
      roomType: "P2P" as const,
    };
  } catch (error) {
    console.error("❌ Failed to find/create P2P room:", error);
    throw error;
  }
};

// Find or create Group room
export const findOrCreateGroupRoom = async (
  userId: string,
  groupId: string,
) => {
  try {
    // Verify group exists and user is a member
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        title: true,
        groupPhoto: true,
        memberIds: true,
        creatorId: true,
      },
    });

    if (!group) {
      throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    }

    const allMemberIds = Array.from(
      new Set([...group.memberIds, group.creatorId]),
    );

    if (!allMemberIds.includes(userId)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You are not a member of this group",
      );
    }

    // Find existing group room
    let room = await prisma.chatRoom.findFirst({
      where: {
        type: "GROUP",
        groupId,
      },
      include: {
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                fullname: true,
                profile: {
                  select: {
                    profileImage: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        group: {
          select: {
            id: true,
            title: true,
            groupPhoto: true,
          },
        },
      },
    });

    let isNewRoom = false;

    // Create room if doesn't exist
    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          type: "GROUP",
          groupId,
          participants: allMemberIds,
        },
        include: {
          messages: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              sender: {
                select: {
                  id: true,
                  fullname: true,
                  profile: {
                    select: {
                      profileImage: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          group: {
            select: {
              id: true,
              title: true,
              groupPhoto: true,
            },
          },
        },
      });
      isNewRoom = true;
    }

    // Get initial messages from Redis (latest 20)
    const initialMessages = await chatRedisService.getMessages(room.id, 20);

    return {
      room,
      isNewRoom,
      initialMessages: initialMessages.reverse(), // Oldest to newest
      group: room.group,
      roomType: "GROUP" as const,
    };
  } catch (error) {
    console.error("❌ Failed to find/create group room:", error);
    throw error;
  }
};

// Send P2P message (after room is created)
export const sendP2PMessage = async (
  roomId: string,
  senderId: string,
  content?: string,
  fileUrl?: string[],
) => {
  try {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room || room.type !== "P2P") {
      throw new ApiError(httpStatus.NOT_FOUND, "P2P room not found");
    }

    const sender = await getUserDetails(senderId);
    if (!sender) {
      throw new ApiError(httpStatus.NOT_FOUND, "Sender not found");
    }

    // Get receiver
    const receiverId = room.participants.find((id) => id !== senderId);
    if (!receiverId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid P2P room");
    }

    // Create message object
    const message: IMessage = {
      roomId,
      senderId,
      content,
      fileUrl: fileUrl || [],
      readBy: [senderId],
      createdAt: new Date(),
      sender: {
        id: sender.id,
        fullname: sender.fullname,
        profileImage: sender.profile?.profileImage || null,
      },
    };

    // Save to Redis immediately
    await chatRedisService.saveMessage(roomId, message);

    // Check if we should flush to database
    if (await chatRedisService.shouldFlushToDB(roomId)) {
      await chatRedisService.flushToDatabase(roomId);
    }

    // Update room's updatedAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    return {
      roomId,
      message,
      receiverId,
      participants: room.participants,
    };
  } catch (error) {
    console.error("❌ Failed to send P2P message:", error);
    throw error;
  }
};

// Send group message (after room is created)
export const sendGroupMessage = async (
  roomId: string,
  senderId: string,
  content?: string,
  fileUrl?: string[],
) => {
  try {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        group: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!room || room.type !== "GROUP") {
      throw new ApiError(httpStatus.NOT_FOUND, "Group room not found");
    }

    const sender = await getUserDetails(senderId);
    if (!sender) {
      throw new ApiError(httpStatus.NOT_FOUND, "Sender not found");
    }

    // Create message object
    const message: IMessage = {
      roomId,
      senderId,
      content,
      fileUrl: fileUrl || [],
      readBy: [senderId],
      createdAt: new Date(),
      sender: {
        id: sender.id,
        fullname: sender.fullname,
        profileImage: sender.profile?.profileImage || null,
      },
    };

    // Save to Redis immediately
    await chatRedisService.saveMessage(roomId, message);

    // Check if we should flush to database
    if (await chatRedisService.shouldFlushToDB(roomId)) {
      await chatRedisService.flushToDatabase(roomId);
    }

    // Update room's updatedAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    return {
      roomId,
      message,
      participants: room.participants,
      groupId: room.groupId,
      group: room.group,
    };
  } catch (error) {
    console.error("❌ Failed to send group message:", error);
    throw error;
  }
};

// Get user chat rooms (conversations list)
export const getUserChatRooms = async (userId: string, limit: number = 20) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: { has: userId },
        // Only show rooms that have at least one message
        messages: {
          some: {},
        },
      },
      include: {
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                fullname: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        group: {
          select: {
            id: true,
            title: true,
            groupPhoto: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    // Get online users
    const onlineUsers = await chatRedisService.getOnlineUsers();

    const enhancedRooms = await Promise.all(
      rooms.map(async (room) => {
        let partner = null;
        let roomName = "";
        let roomImage = null;
        let groupInfo = null;

        if (room.type === "P2P") {
          const partnerId = room.participants.find((id) => id !== userId);
          if (partnerId) {
            const partnerUser = await getUserDetails(partnerId);
            if (partnerUser) {
              partner = {
                id: partnerUser.id,
                name: partnerUser.fullname,
                image: partnerUser.profile?.profileImage,
                online: onlineUsers.includes(partnerId),
              };
              roomName = partnerUser.fullname;
              roomImage = partnerUser.profile?.profileImage;
            }
          }
        } else if (room.type === "GROUP") {
          if (room.group) {
            roomName = room.group.title;
            roomImage = room.group.groupPhoto;
            groupInfo = {
              id: room.group.id,
              title: room.group.title,
              photo: room.group.groupPhoto,
            };
          }
        }

        // Get latest message from Redis (more up-to-date)
        const redisMessages = await chatRedisService.getMessages(room.id, 1);
        const lastMessage = redisMessages[0] || room.messages[0];

        // Get unread count
        const unreadCount = await chatRedisService.getUnreadCount(
          room.id,
          userId,
        );

        return {
          id: room.id,
          type: room.type,
          name: roomName,
          image: roomImage,
          partner,
          group: groupInfo,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
          lastMessageSender: lastMessage?.sender,
          unreadCount,
          participants: room.participants,
          updatedAt: room.updatedAt,
          groupId: room.groupId,
        };
      }),
    );

    return enhancedRooms;
  } catch (error) {
    console.error("❌ Failed to get user chat rooms:", error);
    throw error;
  }
};
```

## 📄 socket.interface.ts

```ts
import WebSocket from "ws";

export interface CustomWebSocket extends WebSocket {
  userId?: string;
}
```

## 📄 websocketSendResponse.ts

```ts
/* import { CustomWebSocket } from "./socket.interface";
export const { stringify,parse } = JSON;

export const wsSendResponse = (
  ws: CustomWebSocket,
  type: string,
  payload: Record<string, unknown>,
) => {
  ws.send(
    JSON.stringify({
      type,
      payload,
    }),
  );
}; */
```

## 🛠️ socket.service.ts

```ts
import jwt from "jsonwebtoken";
import config from "../../../config";
import { WebSocket } from "ws";

// Simple function to verify WebSocket token
export const verifyWsToken = (ws: WebSocket, token: string) => {
  if (!token) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "No token provided",
      }),
    );
    ws.close();
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.jwt_secret as string);
    return decoded as { id: string };
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Invalid or expired token",
      }),
    );
    ws.close();
    return null;
  }
};
```

## 📖 socket.note.md

```markdown
### Core chat concepts (only 6 things you must know)

> ,,w,ca,r,me,b,d (ocar,mebd)

| Concept                                | Meaning                        |
| -------------------------------------- | ------------------------------ |
| ,,WebSocket connection                 | Persistent connection per user |
| ,,Client ID                            | Who is connected               |
| > ,,Roo,c(ruk) ,,Room / ,,Conversation | Group of users chatting        |
| ,,Message                              | Payload sent over socket       |
| ,,Broadcast                            | Send to many users             |
| ,,Disconnect                           | Cleanup when user leaves       |

---

I am good, what's about you, are you fine?
```

## 🎮 socket.controller.ts

```ts
import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyWsToken } from "./socket.service";
import {
  findOrCreateP2PRoom,
  findOrCreateGroupRoom,
  sendP2PMessage,
  sendGroupMessage,
  getUserChatRooms,
  getUserDetails,
} from "./handlers/chat.handler";
import { chatRedisService } from "../../../shared/redis-services/chat.service";
import prisma from "../../../shared/prisma";

// Simple interface for our WebSocket
interface UserSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
  subscribedRooms?: Set<string>;
  activeRoomId?: string;
  connectionId: string; // Unique connection identifier
  lastActivity: number;
}

// Store connected users: userId -> Map<connectionId, WebSocket>
const userConnections = new Map<string, Map<string, UserSocket>>();

// Store connection ID to user ID mapping
const connectionToUser = new Map<string, string>();

// Store room subscribers: roomId -> Set<connectionId>
const roomSubscribers = new Map<string, Set<string>>();

// Generate unique connection ID
const generateConnectionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  // Clear Redis online status on server start
  wss.on("listening", async () => {
    console.log("🚀 WebSocket server started, clearing stale connections...");
    await chatRedisService.clearOnlineSet();
  });

  wss.on("connection", async (ws: UserSocket, req) => {
    // 1. GENERATE UNIQUE CONNECTION ID
    const connectionId = generateConnectionId();
    ws.connectionId = connectionId;
    ws.isAlive = true;
    ws.subscribedRooms = new Set();
    ws.lastActivity = Date.now();

    // 2. AUTHENTICATE USER
    const token = req.headers.token as string;
    const decoded = verifyWsToken(ws, token);

    if (!decoded) {
      ws.close();
      return;
    }

    const userId = decoded.id;
    ws.userId = userId;

    // 3. CLEANUP PREVIOUS CONNECTIONS FOR SAME USER
    cleanupUserConnections(userId);

    // 4. ADD USER TO CONNECTION MAPS
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Map());
    }
    userConnections.get(userId)!.set(connectionId, ws);
    connectionToUser.set(connectionId, userId);

    // 5. SET USER ONLINE IN REDIS
    await chatRedisService.setUserOnline(userId);

    console.log(
      `✅ User ${userId} connected (${connectionId}). Total connections: ${connectionToUser.size}`,
    );

    // 6. SEND USER'S EXISTING CONVERSATIONS
    try {
      const conversations = await getUserChatRooms(userId, 20);

      // Also get online status for users in conversations
      const onlineUsers = await chatRedisService.getOnlineUsers();

      // Enhance conversations with online status
      const enhancedConversations = conversations.map((conv) => {
        if (conv.partner) {
          return {
            ...conv,
            partner: {
              ...conv.partner,
              online: onlineUsers.includes(conv.partner.id),
            },
          };
        }
        return conv;
      });

      ws.send(
        JSON.stringify({
          type: "conversations",
          conversations: enhancedConversations,
        }),
      );

      // Send online status update to others
      broadcastUserStatus(userId, true);
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
    }

    // 7. SET UP HEARTBEAT
    const heartbeat = setInterval(() => {
      if (!ws.isAlive) {
        console.log(`💔 Heartbeat failed for ${userId} (${connectionId})`);
        cleanupConnection(connectionId);
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    ws.on("pong", () => {
      ws.isAlive = true;
      ws.lastActivity = Date.now();
    });

    // 8. HANDLE INCOMING MESSAGES
    ws.on("message", async (rawData) => {
      try {
        ws.lastActivity = Date.now();
        const data = JSON.parse(rawData.toString());
        console.log(`📨 Message from ${userId} (${connectionId}):`, data.type);

        switch (data.type) {
          case "member-subscribe": {
            const { receiverId } = data;
            const result = await findOrCreateP2PRoom(userId, receiverId);

            // Subscribe to room
            subscribeToRoom(connectionId, result.room.id, ws);
            ws.activeRoomId = result.room.id;

            // Mark messages as read
            await chatRedisService.markAsRead(result.room.id, userId);

            // Get partner's online status
            const partnerOnline =
              await chatRedisService.isUserOnline(receiverId);

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: result.room.id,
                roomType: "P2P",
                isNewRoom: result.isNewRoom,
                initialMessages: result.initialMessages,
                partner: {
                  ...result.partner,
                  online: partnerOnline,
                },
              }),
            );

            // Update conversation list for both users
            updateConversationsForUsers([userId, receiverId]);
            break;
          }

          case "subscribe-room": {
            const { roomId } = data;

            // Verify user has access to this room
            const room = await prisma.chatRoom.findFirst({
              where: {
                id: roomId,
                participants: { has: userId },
              },
              include: {
                messages: {
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    sender: {
                      select: {
                        id: true,
                        fullname: true,
                        profile: {
                          select: {
                            profileImage: true,
                          },
                        },
                      },
                    },
                  },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
                group: (room) => ({
                  select: {
                    id: true,
                    title: true,
                    groupPhoto: true,
                  },
                }),
              },
            });

            if (!room) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You don't have access to this room",
                }),
              );
              break;
            }

            // Subscribe to the room
            subscribeToRoom(connectionId, roomId, ws);
            ws.activeRoomId = roomId;

            // Get initial messages from Redis
            const initialMessages = await chatRedisService.getMessages(
              roomId,
              20,
            );

            // Mark messages as read
            await chatRedisService.markAsRead(roomId, userId);

            // Get partner/group details
            let partner = null;
            let roomName = "";
            let roomImage = null;
            let groupInfo = null;

            if (room.type === "P2P") {
              const partnerId = room.participants.find((id) => id !== userId);
              if (partnerId) {
                const partnerUser = await getUserDetails(partnerId);
                if (partnerUser) {
                  const isPartnerOnline =
                    await chatRedisService.isUserOnline(partnerId);
                  partner = {
                    id: partnerUser.id,
                    name: partnerUser.fullname,
                    image: partnerUser.profile?.profileImage,
                    online: isPartnerOnline,
                  };
                  roomName = partnerUser.fullname;
                  roomImage = partnerUser.profile?.profileImage;
                }
              }
            } else if (room.type === "GROUP") {
              if (room.group) {
                roomName = room.group.title;
                roomImage = room.group.groupPhoto;
                groupInfo = {
                  id: room.group.id,
                  title: room.group.title,
                  photo: room.group.groupPhoto,
                };
              }
            }

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: room.id,
                roomType: room.type,
                isNewRoom: false,
                initialMessages: initialMessages.reverse(),
                partner,
                group: groupInfo,
                hasMoreMessages: initialMessages.length >= 20,
              }),
            );

            console.log(
              `👥 User ${userId} subscribed to existing room ${roomId}`,
            );
            break;
          }

          case "group-subscribe": {
            const { groupId } = data;
            const result = await findOrCreateGroupRoom(userId, groupId);

            // Subscribe to room
            subscribeToRoom(connectionId, result.room.id, ws);
            ws.activeRoomId = result.room.id;

            // Mark messages as read
            await chatRedisService.markAsRead(result.room.id, userId);

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: result.room.id,
                roomType: "GROUP",
                isNewRoom: result.isNewRoom,
                initialMessages: result.initialMessages,
                group: result.group,
              }),
            );

            // Update conversation list for all group members
            updateConversationsForUsers(result.room.participants);
            break;
          }

          case "member-send-message": {
            const { roomId, content, fileUrl } = data;

            // Verify user is subscribed to this room
            if (!ws.subscribedRooms?.has(roomId)) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to this room",
                }),
              );
              break;
            }

            const result = await sendP2PMessage(
              roomId,
              userId,
              content,
              fileUrl,
            );

            // Send only to sender (excluding sender from broadcast)
            ws.send(
              JSON.stringify({
                type: "message-sent",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
                timestamp: new Date().toISOString(),
              }),
            );

            // Broadcast to other room subscribers
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
                timestamp: new Date().toISOString(),
              },
              connectionId, // Exclude sender's connection
            );

            // Update conversation list for both users
            updateConversationsForUsers(result.participants);
            break;
          }

          case "group-send-message": {
            const { roomId, content, fileUrl } = data;

            // Verify user is subscribed to this room
            if (!ws.subscribedRooms?.has(roomId)) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to this room",
                }),
              );
              break;
            }

            const result = await sendGroupMessage(
              roomId,
              userId,
              content,
              fileUrl,
            );

            // Send confirmation to sender only
            ws.send(
              JSON.stringify({
                type: "message-sent",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
                timestamp: new Date().toISOString(),
              }),
            );

            // Broadcast to all room subscribers except sender
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
                timestamp: new Date().toISOString(),
              },
              connectionId, // Exclude sender's connection
            );

            // Update conversation list for all group members
            updateConversationsForUsers(result.participants);
            break;
          }

          case "typing": {
            const { roomId, isTyping = true } = data;

            // Broadcast typing indicator to room subscribers except sender
            broadcastToRoomSubscribers(
              roomId,
              "typing",
              {
                roomId,
                senderId: userId,
                isTyping,
              },
              connectionId,
            );
            break;
          }

          case "mark-read": {
            const { roomId } = data;
            await chatRedisService.markAsRead(roomId, userId);

            // Notify room subscribers that messages are read
            broadcastToRoomSubscribers(
              roomId,
              "messages-read",
              {
                roomId,
                userId,
              },
              connectionId,
            );

            // Update conversation list for user
            updateConversationsForUsers([userId]);
            break;
          }

          case "get-more-messages": {
            const { roomId, before, limit = 20 } = data;

            // Get older messages from database
            const olderMessages = await getOlderMessagesFromDB(
              roomId,
              before,
              limit,
              userId,
            );

            ws.send(
              JSON.stringify({
                type: "more-messages",
                roomId,
                messages: olderMessages.messages,
                hasMore: olderMessages.hasMore,
                before: olderMessages.newBefore,
              }),
            );
            break;
          }

          case "unsubscribe-room": {
            const { roomId } = data;
            unsubscribeFromRoom(connectionId, roomId, ws);
            ws.activeRoomId = undefined;

            ws.send(
              JSON.stringify({
                type: "room-unsubscribed",
                roomId,
              }),
            );
            break;
          }

          case "get-conversations": {
            const conversations = await getUserChatRooms(userId, 20);
            const onlineUsersList = await chatRedisService.getOnlineUsers();

            const enhancedConversations = conversations.map((conv) => {
              if (conv.partner) {
                return {
                  ...conv,
                  partner: {
                    ...conv.partner,
                    online: onlineUsersList.includes(conv.partner.id),
                  },
                };
              }
              return conv;
            });

            ws.send(
              JSON.stringify({
                type: "conversations",
                conversations: enhancedConversations,
              }),
            );
            break;
          }

          case "ping": {
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Unknown message type",
              }),
            );
        }
      } catch (error: any) {
        console.error("❌ Error handling message:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message || "Failed to process message",
          }),
        );
      }
    });

    // 9. HANDLE DISCONNECTION
    ws.on("close", async () => {
      console.log(`❌ User ${userId} (${connectionId}) disconnected`);
      cleanupConnection(connectionId);
      clearInterval(heartbeat);
    });

    // 10. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(
        `❌ WebSocket error for user ${userId} (${connectionId}):`,
        error,
      );
      cleanupConnection(connectionId);
    });
  });

  // Clean up inactive connections periodically (every 5 minutes)
  setInterval(() => {
    const now = Date.now();
    connectionToUser.forEach((userId, connId) => {
      const connections = userConnections.get(userId);
      if (connections) {
        const ws = connections.get(connId);
        if (ws && now - ws.lastActivity > 300000) {
          // 5 minutes inactivity
          console.log(
            `🕒 Cleaning up inactive connection: ${connId} for user ${userId}`,
          );
          cleanupConnection(connId);
          ws.terminate();
        }
      }
    });
  }, 60000);

  // Clear Redis online status on server start and cleanup periodically
  wss.on("listening", async () => {
    console.log("🚀 WebSocket server started, clearing stale connections...");

    // Clear online set on server start
    await chatRedisService.clearOnlineSet();

    // Cleanup stale online users every 30 seconds
    setInterval(async () => {
      await chatRedisService.cleanupStaleOnlineUsers();
    }, 30000);

    // Refresh online status for connected users every 2 minutes
    setInterval(async () => {
      userConnections.forEach(async (connections, userId) => {
        if (connections.size > 0) {
          await chatRedisService.refreshUserOnlineStatus(userId);
        }
      });
    }, 120000);
  });

  console.log(
    "✅ WebSocket server is running with improved connection management",
  );
  return wss;
};

// Helper functions
const cleanupUserConnections = (userId: string) => {
  const connections = userConnections.get(userId);
  if (connections) {
    connections.forEach((ws, connId) => {
      // Don't close if already closed
      if (
        ws.readyState !== WebSocket.CLOSED &&
        ws.readyState !== WebSocket.CLOSING
      ) {
        ws.close(1000, "New connection established");
      }
      cleanupConnection(connId);
    });
    connections.clear();
  }
};

const cleanupConnection = (connectionId: string) => {
  const userId = connectionToUser.get(connectionId);
  if (userId) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.delete(connectionId);
      if (connections.size === 0) {
        userConnections.delete(userId);
        // Set user offline in Redis after a delay
        setTimeout(async () => {
          const hasConnections = userConnections.has(userId);
          if (!hasConnections) {
            await chatRedisService.setUserOffline(userId);
            broadcastUserStatus(userId, false);
          }
        }, 5000);
      }
    }
    connectionToUser.delete(connectionId);

    // Unsubscribe from all rooms
    roomSubscribers.forEach((subscribers, roomId) => {
      if (subscribers.has(connectionId)) {
        subscribers.delete(connectionId);
        if (subscribers.size === 0) {
          roomSubscribers.delete(roomId);
        }
      }
    });
  }
};

const subscribeToRoom = (
  connectionId: string,
  roomId: string,
  ws: UserSocket,
) => {
  if (!roomSubscribers.has(roomId)) {
    roomSubscribers.set(roomId, new Set());
  }
  roomSubscribers.get(roomId)!.add(connectionId);

  if (ws.subscribedRooms) {
    ws.subscribedRooms.add(roomId);
  }
};

const unsubscribeFromRoom = (
  connectionId: string,
  roomId: string,
  ws: UserSocket,
) => {
  if (roomSubscribers.has(roomId)) {
    roomSubscribers.get(roomId)!.delete(connectionId);
    if (roomSubscribers.get(roomId)!.size === 0) {
      roomSubscribers.delete(roomId);
    }
  }

  if (ws.subscribedRooms) {
    ws.subscribedRooms.delete(roomId);
  }
};

const broadcastToRoomSubscribers = (
  roomId: string,
  type: string,
  payload: any,
  excludeConnectionId?: string,
) => {
  const subscribers = roomSubscribers.get(roomId);
  if (!subscribers) return;

  subscribers.forEach((connId) => {
    if (connId === excludeConnectionId) return;

    const userId = connectionToUser.get(connId);
    if (!userId) return;

    const connections = userConnections.get(userId);
    if (!connections) return;

    const subscriberWs = connections.get(connId);
    if (subscriberWs && subscriberWs.readyState === WebSocket.OPEN) {
      subscriberWs.send(
        JSON.stringify({
          type,
          ...payload,
        }),
      );
    }
  });
};

const updateConversationsForUsers = async (userIds: string[]) => {
  const onlineUsersList = await chatRedisService.getOnlineUsers();

  for (const userId of userIds) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.forEach(async (userWs) => {
        if (userWs.readyState === WebSocket.OPEN) {
          try {
            const conversations = await getUserChatRooms(userId, 20);

            // Enhance with online status
            const enhancedConversations = conversations.map((conv) => {
              if (conv.partner) {
                return {
                  ...conv,
                  partner: {
                    ...conv.partner,
                    online: onlineUsersList.includes(conv.partner.id),
                  },
                };
              }
              return conv;
            });

            userWs.send(
              JSON.stringify({
                type: "conversations-updated",
                conversations: enhancedConversations,
              }),
            );
          } catch (error) {
            console.error(
              `❌ Failed to update conversations for ${userId}:`,
              error,
            );
          }
        }
      });
    }
  }
};

const getOlderMessagesFromDB = async (
  roomId: string,
  before: string,
  limit: number,
  userId: string,
) => {
  try {
    const beforeDate = new Date(before);

    const messages = await prisma.message.findMany({
      where: {
        roomId,
        createdAt: { lt: beforeDate },
      },
      select: {
        id: true,
        content: true,
        fileUrl: true,
        senderId: true,
        readBy: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            fullname: true,
            profile: {
              select: {
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const hasMore = messages.length >= limit;
    const newBefore =
      messages.length > 0
        ? messages[messages.length - 1].createdAt.toISOString()
        : before;

    return {
      messages,
      hasMore,
      newBefore,
    };
  } catch (error) {
    console.error("❌ Error getting older messages:", error);
    throw error;
  }
};

const broadcastUserStatus = (userId: string, isOnline: boolean) => {
  userConnections.forEach((connections, targetUserId) => {
    if (targetUserId === userId) return; // Don't send to self

    connections.forEach((targetWs) => {
      if (targetWs.readyState === WebSocket.OPEN) {
        targetWs.send(
          JSON.stringify({
            type: "user-status-changed",
            userId,
            isOnline,
            timestamp: new Date().toISOString(),
          }),
        );
      }
    });
  });
};
```
