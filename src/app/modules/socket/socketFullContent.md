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
│   │   │   │   └── chat.service.ts
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
│   │   │   │   ├── socket.controller.ts
│   │   │   │   ├── socket.interface.ts
│   │   │   │   ├── socket.note.md
│   │   │   │   ├── socket.service.ts
│   │   │   │   └── websocketSendResponse.ts
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
├── structure.md
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

30 directories, 104 files
```

## 📁 socket Module Tree

```bash
/home/sj/web/smt_project/ashmaster_backend/src/app/modules/socket
├── socket.controller.ts
├── socket.interface.ts
├── socket.note.md
├── socket.service.ts
└── websocketSendResponse.ts

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
  @@map("checklist_end_goals")
}

//w: (end)  ╰────────────  ChecklistEndGoal ────────────╯

model Group {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  title      String
  memberIds  String[]
  groupPhoto String?
  creator    String   @db.ObjectId
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model ChatRoom {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  type         RoomType
  groupId      String?   @db.ObjectId
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
    "http-status": "^1.7.4",
    "ioredis": "^5.8.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.16",
    "nodemon": "^3.1.4",
    "stripe": "^18.0.0",
    "ws": "^8.19.0",
    "zod": "^3.23.8"
  }
}
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
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { CustomWebSocket } from "./socket.interface";

export const verifyWsToken = (ws: CustomWebSocket, token: string) => {
  if (!token) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not authenticated. Please login first.",
      }),
    );
    return;
  }
  try {
    let decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret,
    );
    return decoded;
  } catch (error: any) {
    let message =
      error.name === "TokenExpiredError"
        ? "Token is expired. Please re login !!!"
        : "Invalid token. Login for revalidate !!!";

    ws.send(
      JSON.stringify({
        type: "error",
        message,
      }),
    );
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
```

## 🎮 socket.controller.ts

```ts
// wsServer.ts
import { Server } from "http";
import prisma from "../../../shared/prisma";
import { WebSocket, WebSocketServer } from "ws";
import { verifyWsToken } from "./socket.service";

// Extend WebSocket to store user info
interface CustomWebSocket extends WebSocket {
  userId?: string;
  rooms?: Set<string>; // P2P rooms
  groups?: Set<string>; // group rooms
}

// Maps for room -> ws connections
const roomUsers = new Map<string, Set<CustomWebSocket>>(); // P2P rooms
const groupUsers = new Map<string, Set<CustomWebSocket>>(); // Group rooms
const connectedUsers = new Set<CustomWebSocket>();

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req) => {
    const token = req.headers.token as string;
    const decoded = verifyWsToken(ws, token);
    if (!decoded) return ws.close();

    ws.userId = decoded.id;
    ws.rooms = new Set();
    ws.groups = new Set();
    connectedUsers.add(ws);

    console.log(`User ${ws.userId} connected`);

    const userAllRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          has: ws.userId,
        },
      },
      include: {
        messages: {
          select: {
            content: true,
            fileUrl: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    ws.send(JSON.stringify({ type: "chatrooms", rooms: userAllRooms }));

    // Get all P2P chat rooms of this user
    const userRooms = await prisma.chatRoom.findMany({
      where: { type: "P2P", participants: { has: ws.userId } },
    });

    for (const room of userRooms) {
      ws.rooms!.add(room.id);
      if (!roomUsers.has(room.id)) roomUsers.set(room.id, new Set());
      roomUsers.get(room.id)!.add(ws);
    }

    // Similarly, join groups
    const groups = await prisma.group.findMany({
      where: { memberIds: { has: ws.userId } },
    });

    for (const group of groups) {
      ws.groups!.add(group.id);
      if (!groupUsers.has(group.id)) groupUsers.set(group.id, new Set());
      groupUsers.get(group.id)!.add(ws);
    }

    // Ping to detect dead connections
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    // --- Helper to join P2P room dynamically ---
    const joinRoom = (roomId: string) => {
      ws.rooms!.add(roomId);
      if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());
      roomUsers.get(roomId)!.add(ws);
    };

    // --- Helper to join Group room ---
    const joinGroup = (groupId: string) => {
      ws.groups!.add(groupId);
      if (!groupUsers.has(groupId)) groupUsers.set(groupId, new Set());
      groupUsers.get(groupId)!.add(ws);
    };

    // --- Handle incoming messages ---
    ws.on("message", async (rawData) => {
      try {
        const { type, payload } = JSON.parse(rawData.toString());

        switch (type) {
          case "p2p-message": {
            let isNewRoom = false;
            const { receiverId, content, fileUrl } = payload;

            // Find or create a P2P room
            let room = await prisma.chatRoom.findFirst({
              where: {
                type: "P2P",
                participants: { hasEvery: [ws.userId!, receiverId] },
              },
            });

            if (!room) {
              room = await prisma.chatRoom.create({
                data: { type: "P2P", participants: [ws.userId!, receiverId] },
              });

              isNewRoom = true;
            }

            const roomId = room.id;
            joinRoom(roomId);

            // Save message
            const message = await prisma.message.create({
              data: {
                roomId,
                senderId: ws.userId!,
                content,
                fileUrl: fileUrl,
                readBy: [ws.userId!],
              },
            });

            if (isNewRoom) {
              const roomPayload = {
                id: room.id,
                type: room.type,
                participants: room.participants,
                lastMessage: message,
              };

              room.participants.forEach((userId) => {
                connectedUsers.forEach((client) => {
                  if (
                    client.userId === userId &&
                    client.readyState === WebSocket.OPEN
                  ) {
                    client.send(
                      JSON.stringify({
                        type: "room-created",
                        room: roomPayload,
                      }),
                    );
                  }
                });
              });
            }

            /* await prisma.chatRoom.updateMany({
              where: {
                type: "P2P",
                participants: {
                  hasEvery: [ws.userId, receiverId],
                },
              },

              data: {
                updatedAt: new Date(),
              },
            }); */

            // Broadcast to room clients

            roomUsers.get(roomId)?.forEach((client) => {
              if (
                client.readyState === WebSocket.OPEN &&
                client.userId !== ws.userId
              ) {
                client.send(JSON.stringify({ type: "p2p-message", message }));
              }
            });

            break;
          }

          case "group-message": {
            const { groupId, content } = payload;
            const group = await prisma.group.findUnique({
              where: { id: groupId },
            });
            if (!group)
              return ws.send(
                JSON.stringify({ type: "error", message: "Group not found" }),
              );

            // Join group if not already
            joinGroup(groupId);

            // Find ChatRoom for this group
            let room = await prisma.chatRoom.findFirst({
              where: { type: "GROUP", groupId },
            });

            if (!room) {
              room = await prisma.chatRoom.create({
                data: { type: "GROUP", groupId, participants: group.memberIds },
              });
            }

            const message = await prisma.message.create({
              data: {
                roomId: room.id,
                senderId: ws.userId!,
                content,
                fileUrl: [],
                readBy: [ws.userId!],
              },
            });

            // Broadcast to all group members
            groupUsers.get(groupId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "group-message", message }));
              }
            });

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
      } catch (err) {
        console.error(err);
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(ws);
      ws.rooms?.forEach((roomId) => {
        const clients = roomUsers.get(roomId);
        clients?.delete(ws);
        if (clients?.size === 0) roomUsers.delete(roomId);
      });

      ws.groups?.forEach((groupId) => {
        const clients = groupUsers.get(groupId);
        clients?.delete(ws);
        if (clients?.size === 0) groupUsers.delete(groupId);
      });

      clearInterval(pingInterval);
      console.log(`User ${ws.userId} disconnected`);
    });
  });
};
```
