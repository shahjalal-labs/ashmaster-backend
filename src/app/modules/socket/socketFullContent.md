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
}

// Store connected users: userId -> WebSocket
const onlineUsers = new Map<string, UserSocket>();

// Store room subscribers: roomId -> Set<userId>
const roomSubscribers = new Map<string, Set<string>>();

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: UserSocket, req) => {
    // 1. AUTHENTICATE USER
    const token = req.headers.token as string;
    const decoded = verifyWsToken(ws, token);

    if (!decoded) {
      ws.close();
      return;
    }

    const userId = decoded.id;
    ws.userId = userId;
    ws.isAlive = true;
    ws.subscribedRooms = new Set();

    // 2. ADD USER TO ONLINE LIST & REDIS
    onlineUsers.set(userId, ws);
    await chatRedisService.setUserOnline(userId);

    console.log(
      `✅ User ${userId} connected. Online users: ${onlineUsers.size}`,
    );

    // 3. SEND USER'S EXISTING CONVERSATIONS (rooms with messages)
    try {
      const conversations = await getUserChatRooms(userId, 20);
      ws.send(
        JSON.stringify({
          type: "conversations",
          conversations,
        }),
      );
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
    }

    // 4. SET UP HEARTBEAT
    const heartbeat = setInterval(() => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // 5. HANDLE INCOMING MESSAGES
    ws.on("message", async (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());
        console.log(`📨 Message from ${userId}:`, data.type);

        switch (data.type) {
          case "member-subscribe": {
            // Subscribe to P2P chat with a user (create room if doesn't exist)
            const { receiverId } = data;

            const result = await findOrCreateP2PRoom(userId, receiverId);

            // Subscribe to room
            subscribeToRoom(userId, result.room.id, ws);
            ws.activeRoomId = result.room.id;

            // Mark messages as read
            await chatRedisService.markAsRead(result.room.id, userId);

            // Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: result.room.id,
                roomType: "P2P",
                isNewRoom: result.isNewRoom,
                initialMessages: result.initialMessages,
                partner: result.partner,
              }),
            );

            // Update conversation list for both users
            updateConversationsForUsers([userId, receiverId]);
            break;
          }

          // Add this to the switch case in the message handler:
          case "subscribe-room": {
            const { roomId } = data;

            // 1. Verify user has access to this room
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
                group: {
                  select: {
                    id: true,
                    title: true,
                    groupPhoto: true,
                  },
                },
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

            // 2. Subscribe to the room
            subscribeToRoom(userId, roomId, ws);
            ws.activeRoomId = roomId;

            // 3. Get initial messages from Redis (latest 20)
            const initialMessages = await chatRedisService.getMessages(
              roomId,
              20,
            );

            // 4. Mark messages as read
            await chatRedisService.markAsRead(roomId, userId);

            // 5. Get partner/group details
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
                    online: await chatRedisService.isUserOnline(partnerId),
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

            // 6. Send room details to user
            ws.send(
              JSON.stringify({
                type: "room-subscribed",
                roomId: room.id,
                roomType: room.type,
                isNewRoom: false,
                initialMessages: initialMessages.reverse(), // Oldest to newest
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
            // Subscribe to group chat
            const { groupId } = data;

            const result = await findOrCreateGroupRoom(userId, groupId);

            // Subscribe to room
            subscribeToRoom(userId, result.room.id, ws);
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
            // Send message in P2P room
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

            // Send to sender
            ws.send(
              JSON.stringify({
                type: "new-message",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
              }),
            );

            // Broadcast to other room subscribers (including receiver)
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "P2P",
              },
              userId, // Exclude sender
            );

            // Update conversation list for both users
            updateConversationsForUsers(result.participants);
            break;
          }

          case "group-send-message": {
            // Send message in group room
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

            // Send to sender
            ws.send(
              JSON.stringify({
                type: "new-message",
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
              }),
            );

            // Broadcast to all room subscribers
            broadcastToRoomSubscribers(
              roomId,
              "new-message",
              {
                roomId,
                message: result.message,
                senderId: userId,
                roomType: "GROUP",
                groupId: result.groupId,
              },
              userId, // Exclude sender
            );

            // Update conversation list for all group members
            updateConversationsForUsers(result.participants);
            break;
          }

          case "typing": {
            const { roomId, isTyping = true } = data;

            // Broadcast typing indicator to room subscribers
            broadcastToRoomSubscribers(
              roomId,
              "typing",
              {
                roomId,
                senderId: userId,
                isTyping,
              },
              userId,
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
              userId,
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
            unsubscribeFromRoom(userId, roomId, ws);
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
            ws.send(
              JSON.stringify({
                type: "conversations",
                conversations,
              }),
            );
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

    // 6. HANDLE DISCONNECTION
    ws.on("close", async () => {
      console.log(`❌ User ${userId} disconnected`);

      // Unsubscribe from all rooms
      if (ws.subscribedRooms) {
        ws.subscribedRooms.forEach((roomId) => {
          unsubscribeFromRoom(userId, roomId, ws);
        });
      }

      // Remove from online users
      onlineUsers.delete(userId);

      // Mark as offline in Redis
      setTimeout(async () => {
        if (!onlineUsers.has(userId)) {
          await chatRedisService.setUserOffline(userId);
          broadcastToUserConnections(userId, "user-offline", { userId });
        }
      }, 5000);

      // Clean up heartbeat
      clearInterval(heartbeat);
    });

    // 7. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error);
    });
  });

  // Helper functions
  const subscribeToRoom = (userId: string, roomId: string, ws: UserSocket) => {
    if (!roomSubscribers.has(roomId)) {
      roomSubscribers.set(roomId, new Set());
    }
    roomSubscribers.get(roomId)!.add(userId);

    if (ws.subscribedRooms) {
      ws.subscribedRooms.add(roomId);
    }
  };

  const unsubscribeFromRoom = (
    userId: string,
    roomId: string,
    ws: UserSocket,
  ) => {
    if (roomSubscribers.has(roomId)) {
      roomSubscribers.get(roomId)!.delete(userId);
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
    excludeUserId?: string,
  ) => {
    const subscribers = roomSubscribers.get(roomId);
    if (!subscribers) return;

    subscribers.forEach((subscriberId) => {
      if (subscriberId === excludeUserId) return;

      const subscriberWs = onlineUsers.get(subscriberId);
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
    for (const userId of userIds) {
      const userWs = onlineUsers.get(userId);
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        try {
          const conversations = await getUserChatRooms(userId, 20);
          userWs.send(
            JSON.stringify({
              type: "conversations-updated",
              conversations,
            }),
          );
        } catch (error) {
          console.error(
            `❌ Failed to update conversations for ${userId}:`,
            error,
          );
        }
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

  const broadcastToUserConnections = (
    userId: string,
    type: string,
    payload: any,
  ) => {
    onlineUsers.forEach((userWs, wsUserId) => {
      if (wsUserId === userId) return;

      if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(
          JSON.stringify({
            type,
            ...payload,
          }),
        );
      }
    });
  };

  console.log("✅ WebSocket server is running with proper room flow");
  return wss;
};
```
