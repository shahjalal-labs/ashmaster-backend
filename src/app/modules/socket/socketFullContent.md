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
│   │   │   │   ├── socketFullContentPrev.md
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

31 directories, 116 files
```

## 📁 socket Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/socket
├── handlers
│   └── chat.handler.ts
├── socket.controller.ts
├── socketFullContentPrev.md
├── socket.interface.ts
├── socket.note.md
├── socket.service.ts
├── websocketSendResponse.ts
└── wstest.json

2 directories, 8 files
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
  id         String    @id @default(auto()) @map("_id") @db.ObjectId
  title      String
  memberIds  String[]
  groupPhoto String?
  creatorId  String    @db.ObjectId
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  chatRoom   ChatRoom?
}

//w: (end)  ╰──────────── Group  ────────────╯

model ChatRoom {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  type         RoomType
  groupId      String?   @unique @db.ObjectId
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

// Get user details for message sender
const getUserDetails = async (userId: string) => {
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

// Simple function to handle P2P messages
export const handleP2PMessage = async (
  senderId: string,
  receiverId: string,
  content?: string,
  fileUrl?: string[],
) => {
  try {
    if (senderId === receiverId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You can't send message to yourself",
      );
    }

    // Verify both users exist
    const [sender, receiver] = await Promise.all([
      getUserDetails(senderId),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!sender || !receiver) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Find or create a chat room
    let room = await prisma.chatRoom.findFirst({
      where: {
        type: "P2P",
        participants: { hasEvery: [senderId, receiverId] },
      },
    });

    let isNewRoom = false;

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          type: "P2P",
          participants: [senderId, receiverId],
          // Set both createdAt and updatedAt to now for new room
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      isNewRoom = true;
    } else {
      // Only update updatedAt if room already exists and we're adding a message
      await prisma.chatRoom.update({
        where: { id: room.id },
        data: { updatedAt: new Date() },
      });
    }

    // Create message object
    const message: IMessage = {
      roomId: room.id,
      senderId,
      content,
      fileUrl: fileUrl || [],
      readBy: [senderId], // Sender has read their own message
      createdAt: new Date(),
      sender: {
        id: sender.id,
        fullname: sender.fullname,
        profileImage: sender.profile?.profileImage || null,
      },
    };

    // Save to Redis immediately for real-time delivery
    await chatRedisService.saveMessage(room.id, message);

    // Check if we should flush to database
    if (await chatRedisService.shouldFlushToDB(room.id)) {
      await chatRedisService.flushToDatabase(room.id);
    }

    return {
      roomId: room.id,
      message,
      isNewRoom,
      roomType: "P2P" as const,
      participants: [senderId, receiverId],
    };
  } catch (error) {
    console.error("❌ Failed to save message:", error);
    throw error;
  }
};

// Function to handle group messages
export const handleGroupMessage = async (
  senderId: string,
  groupId: string,
  content?: string,
  fileUrl?: string[],
) => {
  try {
    const sender = await getUserDetails(senderId);
    if (!sender) {
      throw new ApiError(httpStatus.NOT_FOUND, "Sender not found");
    }

    // Verify group exists and user is a member
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { memberIds: true, creatorId: true },
    });

    if (!group) {
      throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    }

    const allMemberIds = Array.from(
      new Set([...group.memberIds, group.creatorId]),
    );
    if (!allMemberIds.includes(senderId)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You are not a member of this group",
      );
    }

    // Find or create group chat room
    let room = await prisma.chatRoom.findFirst({
      where: { type: "GROUP", groupId },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          type: "GROUP",
          groupId,
          participants: allMemberIds,
        },
      });
    }

    // Create message object
    const message: IMessage = {
      roomId: room.id,
      senderId,
      content,
      fileUrl: fileUrl || [],
      readBy: [senderId], // Sender has read their own message
      createdAt: new Date(),
      sender: {
        id: sender.id,
        fullname: sender.fullname,
        profileImage: sender.profile?.profileImage || null,
      },
    };

    // Save to Redis immediately for real-time delivery
    await chatRedisService.saveMessage(room.id, message);

    // Check if we should flush to database
    if (await chatRedisService.shouldFlushToDB(room.id)) {
      await chatRedisService.flushToDatabase(room.id);
    }

    // Update room's updatedAt in database
    await prisma.chatRoom.update({
      where: { id: room.id },
      data: { updatedAt: new Date() },
    });

    return {
      roomId: room.id,
      message,
      isNewRoom: false,
      roomType: "GROUP" as const,
      participants: allMemberIds,
      groupId,
    };
  } catch (error) {
    console.error("❌ Failed to save group message:", error);
    throw error;
  }
};

// Function to get chat rooms for a user with last message and online status
export const getUserChatRooms = async (userId: string, limit: number = 20) => {
  try {
    // Get rooms from database
    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: { has: userId },
      },
      include: {
        messages: {
          select: {
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

    // Enhance rooms with partner info and online status
    const enhancedRooms = await Promise.all(
      rooms.map(async (room) => {
        let partner = null;
        let roomName = "";
        let roomImage = null;
        let groupInfo = null;

        if (room.type === "P2P") {
          // Find the other user in P2P chat
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
          // For group chats, get group info
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

        // Get last message from Redis (more up-to-date)
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
          group: groupInfo, // Add group info for GROUP rooms
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null, // Only set if there's a message
          unreadCount,
          participants: room.participants,
          updatedAt: room.updatedAt,
          groupId: room.groupId,
        };
      }),
    );

    // Cache the rooms
    await chatRedisService.cacheUserRooms(userId, enhancedRooms);

    return enhancedRooms;
  } catch (error) {
    console.error("❌ Failed to get user chat rooms:", error);
    throw error;
  }
};

// Function to get message history for a room
export const getRoomMessages = async (
  roomId: string,
  userId: string,
  limit: number = 50,
) => {
  try {
    // Verify user has access to this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: { has: userId },
      },
    });

    if (!room) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You don't have access to this room",
      );
    }

    // Get messages from Redis (most recent)
    const redisMessages = await chatRedisService.getMessages(roomId, limit);

    // If we need more messages, fetch from database
    let dbMessages: any[] = [];
    if (redisMessages.length < limit) {
      const needed = limit - redisMessages.length;
      dbMessages = await prisma.message.findMany({
        where: { roomId },
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
        take: needed,
        skip: 0,
      });
    }

    // Combine and sort messages (newest first)
    const allMessages = [...redisMessages, ...dbMessages]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);

    // Mark messages as read for this user
    await chatRedisService.markAsRead(roomId, userId);

    return {
      roomId,
      messages: allMessages,
      hasMore: allMessages.length >= limit,
    };
  } catch (error) {
    console.error("❌ Failed to get room messages:", error);
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

## 📖 socketFullContentPrev.md

````markdown
## another model for better clarity rest api pattern,

## 🎮 group.controller.ts

```ts
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { GroupService } from "./group.service";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = catchAsync(async (req, res) => {
  await GroupService.createGroup(req.user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Group successfully created.",
    data: null,
  });
});
//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── getGroupDetails ────────────╮
const getGroupDetails = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const group = await GroupService.getGroupDetails(groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group details fetched successfully.",
    data: group,
  });
});
//w: (end)  ╰──────────── getGroupDetails ────────────╯

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroup = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  await GroupService.updateGroup(userId, groupId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group updated successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── updateGroup ────────────╯

//w: (start)╭──────────── fetchAllMembers ────────────╮
const fetchAllMembers = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const pickedPagination = pick(req.query, paginationOptions);

  const result = await GroupService.fetchAllMembers(groupId, pickedPagination);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched all members successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── fetchAllMembers ────────────╯

//w: (start)╭──────────── leaveGroup ────────────╮
const leaveGroup = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  const result = await GroupService.leaveGroup(userId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Left group successfully.",
    data: result,
  });
});
//w: (end)  ╰──────────── leaveGroup ────────────╯

//w: (start)╭──────────── findMembersToAdd ────────────╮
const findMembersToAdd = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  const result = await GroupService.findMembersToAdd(userId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched connections to add into group",
    data: result,
  });
});
//w: (end)  ╰──────────── findMembersToAdd ────────────╯

//w: (start)╭──────────── addMembersIntoGroup ────────────╮
const addMembersIntoGroup = catchAsync(async (req, res) => {
  // const { id: userId } = req.user;
  const { memberId } = req.body;
  const { id: groupId } = req.params;
  const result = await GroupService.addMembersIntoGroup(memberId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Memeber added into group successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── addMembersIntoGroup ────────────╯

export const GroupController = {
  createGroup,
  getGroupDetails,
  updateGroup,
  fetchAllMembers,
  leaveGroup,
  findMembersToAdd,
  addMembersIntoGroup,
};
```
````

## 🧪 group.api.hurl

```bash
# create group
POST {{port6011}}/group/create
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "title":"Data Science Mentoring",
 "groupPhoto": "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1768019205514-v4ull7jpu0e.png",
 "memberIds": ["694a39873340ac9b4e13823d"]
}

# fetch group details
GET {{port6011}}/group/6964e4e1656ea48b225e0eb4
Authorization: {{ashRaisa}}


# update group (creator only)
PATCH {{port6011}}/group/6964e4e1656ea48b225e0eb4
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}

Content-Type: application/json

{
 "title":"Data Science Mentoring"
}


# fetchAllMembers
#/ /members/groupId
GET {{port6011}}/group/members/6964e4e1656ea48b225e0eb4?page=1&limit=20
Authorization: {{ashRaisa}}


#  leave group (member only)
DELETE {{port6011}}/group/6964e4e1656ea48b225e0eb4/leave
#Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}

#  find members to add
GET {{port6011}}/group/6964e4e1656ea48b225e0eb4/find-members
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}



# addMembersIntoGroup
#/ /group/groupId
POST {{port6011}}/group/6964e4e1656ea48b225e0eb4/add-member
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "memberId":"694a39873340ac9b4e138239"
}
```

## 🛠️ group.service.ts

```ts
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema, TUpdateGroupSchema } from "./group.validation";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: TCreateGroupSchema) => {
  const uniqueMemberIds = [...new Set(payload.memberIds)];

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: uniqueMemberIds,
      },
    },
  });
  if (users.length !== uniqueMemberIds.length)
    throw new ApiError(httpStatus.NOT_FOUND, "some of  member is not found");

  await prisma.group.create({
    data: {
      ...payload,
      creatorId: userId,
    },
  });
};
//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── getGroupDetails ────────────╮
const getGroupDetails = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found!");
  return group;
};
//w: (end)  ╰──────────── getGroupDetails ────────────╯

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroup = async (
  userId: string,
  groupId: string,
  payload: TUpdateGroupSchema,
) => {
  const [group, user] = await Promise.all([
    prisma.group.findUnique({
      where: {
        id: groupId,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
  ]);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found");

  if (group.creatorId !== userId)
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only the creator can update the group",
    );

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: payload,
  });

  return;
};
//w: (end)  ╰──────────── updateGroup ────────────╯

//w: (start)╭──────────── fetchAllMembers ────────────╮
const fetchAllMembers = async (
  groupId: string,
  paginations: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      memberIds: true,
      creatorId: true,
    },
  });

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
  }

  //merge + convert into unique ids
  const userIds = Array.from(new Set([...group.memberIds, group.creatorId]));

  const [total, members] = await Promise.all([
    // total count
    prisma.user.count({
      where: {
        id: { in: userIds },
      },
    }),
    // members
    prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
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
      skip,
      take: limit,
      // sort with createdAt:desc same  as id desc
      orderBy: { id: "desc" },
    }),
  ]);

  //Single, clean query

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: members,
  };
};

//w: (end)  ╰──────────── fetchAllMembers ────────────╯

//w: (start)╭──────────── leaveGroup ────────────╮
const leaveGroup = async (userId: string, groupId: string) => {
  // transaction to solve race conditions
  const result = await prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        creatorId: true,
        memberIds: true,
      },
    });

    if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    if (userId === group.creatorId)
      throw new ApiError(httpStatus.BAD_REQUEST, "Creator cannot leave group");

    if (!group.memberIds.includes(userId)) {
      return group;
    }
    const remainMemberIds = group.memberIds.filter((id) => id !== userId);

    const result = await tx.group.update({
      where: {
        id: groupId,
      },
      data: {
        memberIds: remainMemberIds,
      },
    });
    return result;
  });
  return {
    id: result.id,
    memberIds: result.memberIds,
    creatorId: result.creatorId,
  };
};
//w: (end)  ╰──────────── leaveGroup ────────────╯

//w: (start)╭──────────── findMembersToAdd ────────────╮
// connected by connections and not a member in the particular group
const findMembersToAdd = async (userId: string, groupId: string) => {
  const connections = await prisma.connections.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ receiverId: userId }, { senderId: userId }],
    },
    select: {
      senderId: true,
      sender: {
        select: {
          id: true,
          fullname: true,
          profile: {
            select: {
              profession: true,
              profileImage: true,
            },
          },
        },
      },
      receiverId: true,
      receiver: {
        select: {
          id: true,
          fullname: true,
          profile: {
            select: {
              profession: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  // normalize connections → always "the other user"
  const connectedWithMe = connections.map((c) =>
    c.senderId === userId ? c.receiver : c.sender,
  );

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { memberIds: true },
  });

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
  }

  const groupMemberSet = new Set(group.memberIds);

  const connectedButNotInGroup = connectedWithMe.filter(
    (user) => !groupMemberSet.has(user.id),
  );

  return connectedButNotInGroup;
};

//w: (end)  ╰──────────── findMembersToAdd ────────────╯

//w: (start)╭──────────── addMembersIntoGroup ────────────╮
const addMembersIntoGroup = async (memberId: string, groupId: string) => {
  return prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id: groupId },
      select: { memberIds: true },
    });

    if (!group) {
      throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    }

    // already a member → no-op (idempotent)
    if (group.memberIds.includes(memberId)) {
      return group;
    }

    const updatedMembers = [...group.memberIds, memberId];

    return tx.group.update({
      where: { id: groupId },
      data: {
        memberIds: updatedMembers,
      },
      select: {
        memberIds: true,
      },
    });
  });
};

//w: (end)  ╰──────────── addMembersIntoGroup ────────────╯

export const GroupService = {
  createGroup,
  getGroupDetails,
  updateGroup,
  fetchAllMembers,
  leaveGroup,
  findMembersToAdd,
  addMembersIntoGroup,
};
```

## 📝 group.validation.ts

```ts
import { z } from "zod";

//w: (start)╭──────────── createGroup ────────────╮

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const createGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
    memberIds: z
      .array(objectIdSchema)
      .min(1, "At least one member is required")
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate member IDs are not allowed",
      ),
  })
  .strict();

//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
  })
  .strict();

export type TUpdateGroupSchema = z.infer<typeof updateGroupSchema>;

//w: (end)  ╰──────────── updateGroup ────────────╯

const addMembersIntoGroupSchema = z
  .object({
    memberId: z.string().length(24),
  })
  .strict();

export type TCreateGroupSchema = z.infer<typeof createGroupSchema>;

export const GroupValidation = {
  createGroupSchema,
  updateGroupSchema,
  addMembersIntoGroupSchema,
};
```

## 🔧 group.routes.ts

```ts
import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import { GroupController } from "./group.controller";
import validateRequest from "../../middlewares/validateRequest";
import { GroupValidation } from "./group.validation";

const router = Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.post(
  "/create",
  validateRequest(GroupValidation.createGroupSchema),
  GroupController.createGroup,
);

router.get("/:id", GroupController.getGroupDetails);

router.patch(
  "/:id",
  validateRequest(GroupValidation.updateGroupSchema),
  GroupController.updateGroup,
);

//  /members/groupId
router.get("/members/:id", GroupController.fetchAllMembers);

// /groupId/leave
router.delete("/:id/leave", GroupController.leaveGroup);

// /groupId/find-members
router.get("/:id/find-members", GroupController.findMembersToAdd);

router.post(
  "/:id/add-member",
  validateRequest(GroupValidation.addMembersIntoGroupSchema),
  GroupController.addMembersIntoGroup,
);

export const GroupRoutes = router;
```

````

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
````

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
  handleP2PMessage,
  handleGroupMessage,
  getUserChatRooms,
  getRoomMessages,
} from "./handlers/chat.handler";
import { chatRedisService } from "../../../shared/redis-services/chat.service";
import prisma from "../../../shared/prisma";

// Simple interface for our WebSocket
interface UserSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

// Store connected users: userId -> WebSocket
const onlineUsers = new Map<string, UserSocket>();

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

    // 2. ADD USER TO ONLINE LIST & REDIS
    onlineUsers.set(userId, ws);
    await chatRedisService.setUserOnline(userId);

    console.log(
      `✅ User ${userId} connected. Online users: ${onlineUsers.size}`,
    );

    // 3. BROADCAST ONLINE STATUS TO USER'S CONNECTIONS
    broadcastToUserConnections(userId, "user-online", { userId });

    // 4. SEND USER'S CHAT ROOMS
    try {
      const rooms = await getUserChatRooms(userId, 20);
      ws.send(
        JSON.stringify({
          type: "chatrooms",
          rooms,
        }),
      );
    } catch (error) {
      console.error("❌ Failed to fetch chat rooms:", error);
    }

    // 5. SET UP HEARTBEAT (keep connection alive)
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

    // 6. HANDLE INCOMING MESSAGES
    ws.on("message", async (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());
        console.log(`📨 Message from ${userId}:`, data.type);

        switch (data.type) {
          case "p2p-message": {
            const { receiverId, content, fileUrl } = data;

            // Save and process message
            const result = await handleP2PMessage(
              userId,
              receiverId,
              content,
              fileUrl,
            );

            // Send to receiver if online
            const receiverWs = onlineUsers.get(receiverId);
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(
                JSON.stringify({
                  type: "p2p-message",
                  message: result.message,
                  roomId: result.roomId,
                  senderId: userId,
                  isNewRoom: result.isNewRoom,
                }),
              );
            }

            // Send confirmation to sender
            ws.send(
              JSON.stringify({
                type: "message-sent",
                // messageId: result.message.id,
                roomId: result.roomId,
              }),
            );

            // Update chat rooms for both users
            updateChatRoomsForUsers([userId, receiverId]);
            break;
          }

          case "group-message": {
            const { groupId, content, fileUrl } = data;

            // Save and process group message
            const result = await handleGroupMessage(
              userId,
              groupId,
              content,
              fileUrl,
            );

            // Send to all online group members except sender
            result.participants.forEach((memberId) => {
              if (memberId !== userId) {
                const memberWs = onlineUsers.get(memberId);
                if (memberWs && memberWs.readyState === WebSocket.OPEN) {
                  memberWs.send(
                    JSON.stringify({
                      type: "group-message",
                      message: result.message,
                      roomId: result.roomId,
                      senderId: userId,
                      groupId,
                    }),
                  );
                }
              }
            });

            // Send confirmation to sender
            ws.send(
              JSON.stringify({
                type: "group-message-sent",
                // messageId: result.message.id,
                roomId: result.roomId,
              }),
            );

            // Update chat rooms for all group members
            updateChatRoomsForUsers(result.participants);
            break;
          }

          case "typing": {
            const { receiverId, roomId } = data;
            const receiverWs = onlineUsers.get(receiverId);

            if (receiverWs) {
              receiverWs.send(
                JSON.stringify({
                  type: "typing",
                  senderId: userId,
                  roomId,
                  isTyping: true,
                }),
              );
            }
            break;
          }

          case "typing-stop": {
            const { receiverId, roomId } = data;
            const receiverWs = onlineUsers.get(receiverId);

            if (receiverWs) {
              receiverWs.send(
                JSON.stringify({
                  type: "typing",
                  senderId: userId,
                  roomId,
                  isTyping: false,
                }),
              );
            }
            break;
          }

          case "mark-read": {
            const { roomId } = data;
            await chatRedisService.markAsRead(roomId, userId);

            // Notify others in the room that messages are read
            const room = await prisma.chatRoom.findUnique({
              where: { id: roomId },
              select: { participants: true },
            });

            if (room) {
              room.participants.forEach((participantId) => {
                if (participantId !== userId) {
                  const participantWs = onlineUsers.get(participantId);
                  if (participantWs) {
                    participantWs.send(
                      JSON.stringify({
                        type: "messages-read",
                        roomId,
                        userId,
                      }),
                    );
                  }
                }
              });
            }
            break;
          }

          case "get-messages": {
            const { roomId, limit = 50 } = data;
            const result = await getRoomMessages(roomId, userId, limit);

            ws.send(
              JSON.stringify({
                type: "room-messages",
                roomId,
                messages: result.messages,
                hasMore: result.hasMore,
              }),
            );
            break;
          }

          case "get-more-messages": {
            const { roomId, before, limit = 20 } = data;
            // This would fetch older messages from database
            // Implement pagination based on before timestamp
            ws.send(
              JSON.stringify({
                type: "more-messages",
                roomId,
                messages: [], // Implement pagination logic here
                hasMore: false,
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

    // 7. HANDLE DISCONNECTION
    ws.on("close", async () => {
      console.log(`❌ User ${userId} disconnected`);

      // Remove from online users
      onlineUsers.delete(userId);

      // Mark as offline in Redis with delay
      setTimeout(async () => {
        // Check if user reconnected in the meantime
        if (!onlineUsers.has(userId)) {
          await chatRedisService.setUserOffline(userId);
          broadcastToUserConnections(userId, "user-offline", { userId });
        }
      }, 5000); // 5 second delay to handle reconnections

      // Clean up heartbeat
      clearInterval(heartbeat);
    });

    // 8. HANDLE ERRORS
    ws.on("error", (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error);
    });
  });

  // Function to broadcast to all connections of a user
  const broadcastToUserConnections = (
    userId: string,
    type: string,
    payload: any,
  ) => {
    // This would get all users who have chat rooms with this user
    // For simplicity, we'll implement this based on your requirements
  };

  // Function to update chat rooms for users
  const updateChatRoomsForUsers = async (userIds: string[]) => {
    for (const userId of userIds) {
      const userWs = onlineUsers.get(userId);
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        try {
          const rooms = await getUserChatRooms(userId, 20);
          userWs.send(
            JSON.stringify({
              type: "chatrooms-updated",
              rooms,
            }),
          );
        } catch (error) {
          console.error(`❌ Failed to update rooms for ${userId}:`, error);
        }
      }
    }
  };

  console.log("✅ WebSocket server is running");
  return wss;
};
```
