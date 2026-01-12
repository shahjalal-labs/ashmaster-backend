# socketFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/maciewitter-backend
├── bun.lock
├── jest.config.js
├── module.js
├── package.json
├── prisma
│   └── schema.prisma
├── public
│   └── privacy-policy.html
├── README.md
├── src
│   ├── app
│   │   ├── interfaces
│   │   │   ├── common.ts
│   │   │   └── file.ts
│   │   ├── middlewares
│   │   │   ├── auth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── parseBodyData.ts
│   │   │   ├── postman.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.sevice.test.ts
│   │   │   │   ├── auth.test.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── friend
│   │   │   │   ├── friend.controller.ts
│   │   │   │   ├── friend.routes.ts
│   │   │   │   ├── friend.service.ts
│   │   │   │   └── friend.validation.ts
│   │   │   ├── group
│   │   │   │   ├── group.controller.ts
│   │   │   │   ├── group.routes.ts
│   │   │   │   ├── group.service.ts
│   │   │   │   └── group.validation.ts
│   │   │   ├── socket
│   │   │   │   ├── socket.controller.ts
│   │   │   │   ├── socket.interface.ts
│   │   │   │   └── socket.service.ts
│   │   │   └── user
│   │   │       ├── user.controller.ts
│   │   │       ├── user.route.ts
│   │   │       ├── user.services.ts
│   │   │       └── user.validation.ts
│   │   └── routes
│   │       └── index.ts
│   ├── app.ts
│   ├── config
│   │   └── index.ts
│   ├── errors
│   │   ├── ApiErrors.ts
│   │   ├── handleClientError.ts
│   │   ├── handleValidationError.ts
│   │   ├── handleZodError.ts
│   │   └── parsePrismaValidationError.ts
│   ├── helpers
│   │   ├── fileUploader.ts
│   │   ├── generateOtp.ts
│   │   ├── jwtHelpers.ts
│   │   ├── radis.ts
│   │   ├── sendEmail.ts
│   │   └── uploadInSpace.ts
│   ├── interfaces
│   │   ├── common.ts
│   │   ├── error.ts
│   │   ├── file.ts
│   │   ├── index.d.ts
│   │   └── paginations.ts
│   ├── server.ts
│   └── shared
│       ├── catchAsync.ts
│       ├── pagination.ts
│       ├── pick.ts
│       ├── prisma.ts
│       ├── searchFilter.ts
│       └── sendResponse.ts
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

20 directories, 64 files
```

## 📁 socket Module Tree

```bash
/home/sj/web/smt_project/maciewitter-backend/src/app/modules/socket
├── socket.controller.ts
├── socket.interface.ts
└── socket.service.ts

1 directory, 3 files
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

model User {
  id               String         @id @default(auto()) @map("_id") @db.ObjectId
  fullName         String
  email            String         @unique
  password         String
  fcmToken         String?
  profileImage     String?
  gender           String?
  dob              String         @default("20-12-2000") //DD-MM-YY
  role             UserRole       @default(User)
  status           UserStatus     @default(Active)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  sentRequests     Friend[]       @relation("Requester")
  receivedRequests Friend[]       @relation("Recipient")
  sender           Room[]         @relation("user1Relation")
  receiver         Room[]         @relation("user2Relation")
  groupMessage     GroupMessage[]

  @@map("users")
}

model Friend {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  requesterId String       @db.ObjectId
  recipientId String       @db.ObjectId
  status      FriendStatus @default(Pending)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  requester   User         @relation("Requester", fields: [requesterId], references: [id], onDelete: Cascade)
  recipient   User         @relation("Recipient", fields: [recipientId], references: [id], onDelete: Cascade)

  @@unique([requesterId, recipientId]) // prevent duplicate requests
  @@map("friends")
}

model Group {
  id           String         @id @default(auto()) @map("_id") @db.ObjectId
  groupName    String
  groupPhoto   String
  creatorId    String         @db.ObjectId
  memberIds    String[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  groupMessage GroupMessage[]

  @@map("groups")
}

model GroupMessage {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  groupId      String   @db.ObjectId
  content      String?
  fullName     String
  profileImage String
  fileUrl      String[]
  senderId     String   @db.ObjectId
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  group        Group    @relation(fields: [groupId], references: [id])
  sender       User     @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@map("group_messages")
}

model Room {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  user1Id   String?  @db.ObjectId
  user2Id   String?  @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user1 User? @relation("user1Relation", fields: [user1Id], references: [id], onDelete: Cascade)
  user2 User? @relation("user2Relation", fields: [user2Id], references: [id], onDelete: Cascade)

  message Message[]

  @@unique([user1Id, user2Id])
  @@map("rooms")
}

model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  roomId    String   @db.ObjectId
  user1Id   String   @db.ObjectId
  user2Id   String   @db.ObjectId
  content   String?
  fileUrl   String[]
  user1Read Boolean  @default(false)
  user2Read Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)

  @@map("messages")
}

enum FriendStatus {
  Pending
  Accepted
}

enum UserStatus {
  Active
  Blocked
  Deleted
}

enum UserRole {
  Admin
  User
}
```

## 📦 package.json

```json
{
  "name": "maciewitter",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node ./dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "postinstall": "prisma generate",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "keywords": [],
  "author": "Ruhul-Amin",
  "license": "ISC",
  "description": "maciewitter",
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^30.0.0",
    "@types/node": "^20.14.11",
    "@types/nodemailer": "^6.4.17",
    "@types/ws": "^8.18.1",
    "jest": "^30.0.4",
    "prisma": "^6.5.0",
    "ts-jest": "^29.4.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.3"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.839.0",
    "@aws-sdk/lib-storage": "^3.839.0",
    "@prisma/client": "^6.5.0",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "http-status": "^1.7.4",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.16",
    "nodemon": "^3.1.4",
    "redis": "^5.6.0",
    "ws": "^8.18.3",
    "zod": "^3.23.8"
  }
}
```

## 📄 socket.interface.ts

```ts
export interface CustomWebSocket extends WebSocket {
  userId?: string;
}
```

## 🛠️ socket.service.ts

```ts
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

export function verifyWebSocketToken(ws: any, token: string) {
  if (!token) {
    ws.send(
      JSON.stringify({ type: "error", message: "You are not authenticated" })
    );
    return null;
  }

  try {
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as string
    );
    return decoded;
  } catch (error: any) {
    const errorMessage =
      error.name === "TokenExpiredError"
        ? "Token has expired!"
        : "Invalid token!";

    ws.send(JSON.stringify({ type: "error", message: errorMessage }));
    return null;
  }
}
```

## 🎮 socket.controller.ts

```ts
import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import prisma from "../../../shared/prisma";
import { verifyWebSocketToken } from "./socket.service";
import redisClient from "../../../helpers/radis";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const roomUsers = new Map<string, Set<WebSocket>>();
const groupUsers = new Map<string, Set<WebSocket>>();
const connectedUsers = new Set<CustomWebSocket>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.headers["x-token"] as string;
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) {
      return;
    }
    const userId = decoded.id;
    ws.userId = userId;
    connectedUsers.add(ws);
    // Save the socket for later
    if (!roomUsers.has(userId)) roomUsers.set(userId, new Set());
    roomUsers.get(userId)?.add(ws);
    if (!groupUsers.has(userId)) groupUsers.set(userId, new Set());
    groupUsers.get(userId)?.add(ws);

    let roomId: string | null = null;
    let groupId: string | null = null;

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    const conversations = await prisma.room.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: { updatedAt: "desc" },
      include: {
        user1: {
          select: { id: true, fullName: true, profileImage: true },
        },
        user2: {
          select: { id: true, fullName: true, profileImage: true },
        },
      },
    });
    const connectedUserIds = Array.from(connectedUsers)
      .map((ws) => ws.userId)
      .filter((id) => id !== undefined);

    const formattedConversations = await Promise.all(
      conversations.map(async (room) => {
        const partner = room.user1Id === userId ? room.user2 : room.user1;
        const isActive = connectedUserIds.includes(partner?.id as string);

        const redisKey = `room:${room.id}:messages`;
        const unreadKey = `room:${room.id}:unread:${userId}`;

        const [redisRaw, unreadCountStr] = await Promise.all([
          redisClient.lRange(redisKey, 0, -1),
          redisClient.get(unreadKey),
        ]);

        const unreadCount = parseInt(unreadCountStr || "0", 10);
        let latestMessage = null;

        if (redisRaw.length > 0) {
          const redisMessages = redisRaw.map((msg) => JSON.parse(msg));

          // Sort by createdAt descending
          redisMessages.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          const latestRedisMsg = redisMessages[0];

          latestMessage = {
            content:
              latestRedisMsg.content ??
              (latestRedisMsg.fileUrl ? "sent file" : null),
            createdAt: latestRedisMsg.createdAt,
          };
        }

        return {
          roomId: room.id,
          partner: {
            id: partner?.id,
            fullName: partner?.fullName,
            profileImage: partner?.profileImage,
            isActive,
          },
          lastMessage: latestMessage,
          unreadCount, // From Redis
        };
      })
    );
    ws.send(
      JSON.stringify({
        type: "member-conversation",
        conversations: formattedConversations,
      })
    );

    const groupConversations = async () => {
      const groups = await prisma.group.findMany({
        where: {
          memberIds: {
            has: userId,
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return Promise.all(
        groups.map(async (room) => {
          const redisKey = `group:${room.id}:messages`;
          const unreadKey = `group:${room.id}:unread:${userId}`;
          const unreadCount = parseInt(
            (await redisClient.get(unreadKey)) || "0",
            10
          );

          // Get the latest message from Redis
          const buffered = await redisClient.lRange(redisKey, -1, -1);
          const lastMessage =
            buffered.length > 0 ? JSON.parse(buffered[0]) : null;

          // Determine content
          const lastMessageContent =
            lastMessage?.content ||
            (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

          return {
            roomId: room.id,
            groupName: room.groupName,
            groupPhoto: room.groupPhoto,
            lastMessage: lastMessage
              ? {
                  content: lastMessageContent,
                  createdAt: lastMessage?.createdAt || null,
                }
              : null,
            unreadCount,
          };
        })
      );
    };

    const groupConvs = await groupConversations();
    ws.send(
      JSON.stringify({
        type: "group-conversation",
        conversations: groupConvs,
      })
    );

    ws.on("message", async (message: any) => {
      try {
        const { type, receiverId, content, fileUrl, incomingGroupId } =
          JSON.parse(message.toString());

        const getConversationsForUser = async (targetUserId: string) => {
          const rooms = await prisma.room.findMany({
            where: {
              OR: [{ user1Id: targetUserId }, { user2Id: targetUserId }],
            },
            orderBy: { updatedAt: "desc" },
            include: {
              user1: {
                select: { id: true, fullName: true, profileImage: true },
              },
              user2: {
                select: { id: true, fullName: true, profileImage: true },
              },
            },
          });

          return Promise.all(
            rooms.map(async (room) => {
              const partner =
                room.user1Id === targetUserId ? room.user2 : room.user1;
              const isActive = connectedUserIds.includes(partner?.id as string);

              const redisKey = `room:${room.id}:messages`;
              const unreadKey = `room:${room.id}:unread:${targetUserId}`;

              // Get the latest message from Redis
              const buffered = await redisClient.lRange(redisKey, -1, -1);
              const lastMessage =
                buffered.length > 0 ? JSON.parse(buffered[0]) : null;

              // Get unread count from Redis (fallback to 0 if not found)
              const unreadCountStr = await redisClient.get(unreadKey);
              const unreadCount = parseInt(unreadCountStr || "0", 10);

              // Determine content
              const lastMessageContent =
                lastMessage?.content ||
                (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

              return {
                roomId: room.id,
                partner: {
                  id: partner?.id,
                  fullName: partner?.fullName,
                  profileImage: partner?.profileImage,
                  isActive,
                },
                lastMessage: lastMessage
                  ? {
                      content: lastMessageContent,
                      createdAt: lastMessage?.createdAt || null,
                    }
                  : null,
                unreadCount,
              };
            })
          );
        };

        const groupConversationForUser = async (targetUserId: string) => {
          const groups = await prisma.group.findMany({
            where: {
              memberIds: {
                has: targetUserId,
              },
            },
            orderBy: { updatedAt: "desc" },
          });

          return Promise.all(
            groups.map(async (room) => {
              const redisKey = `group:${room.id}:messages`;
              const unreadKey = `group:${room.id}:unread:${targetUserId}`;
              const unreadCount = parseInt(
                (await redisClient.get(unreadKey)) || "0",
                10
              );

              // Get the latest message from Redis
              const buffered = await redisClient.lRange(redisKey, -1, -1);
              const lastMessage =
                buffered.length > 0 ? JSON.parse(buffered[0]) : null;

              // Determine content
              const lastMessageContent =
                lastMessage?.content ||
                (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

              return {
                roomId: room.id,
                groupName: room.groupName,
                groupPhoto: room.groupPhoto,
                lastMessage: lastMessage
                  ? {
                      content: lastMessageContent,
                      createdAt: lastMessage?.createdAt || null,
                    }
                  : null,
                unreadCount,
              };
            })
          );
        };

        switch (type) {
          case "member-subscribe": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiverId is required",
                })
              );
            }

            let room =
              (await prisma.room.findFirst({
                where: {
                  OR: [
                    { user1Id: userId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: userId },
                  ],
                },
              })) ||
              (await prisma.room.create({
                data: { user1Id: userId, user2Id: receiverId },
              }));

            roomId = room.id;

            const unreadKey = `room:${roomId}:unread:${userId}`;
            await redisClient.set(unreadKey, "0");

            roomUsers.forEach((clients, key) => {
              if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) roomUsers.delete(key);
              }
            });

            if (!roomUsers.has(roomId)) {
              roomUsers.set(roomId, new Set());
            }
            roomUsers.get(roomId)?.add(ws);

            const redisKey = `room:${roomId}:messages`;
            const redisRaw = await redisClient.lRange(redisKey, -15, -1);
            const messages = redisRaw.reverse().map((msg) => JSON.parse(msg));

            ws.send(
              JSON.stringify({
                type: "past-messages",
                roomId,
                messages: messages,
              })
            );

            break;
          }

          case "member-send-message": {
            if (!roomId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to any room",
                })
              );
            }

            const roomInfo = await prisma.room.findUnique({
              where: { id: roomId },
              select: { user1Id: true, user2Id: true },
            });

            if (!roomInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Room not found",
                })
              );
            }

            const messagePayload = {
              content,
              user1Id: userId,
              user2Id: receiverId,
              roomId,
              fileUrl,
              createdAt: new Date().toISOString(),
            };

            const redisKey = `room:${roomId}:messages`;
            await redisClient.rPush(redisKey, JSON.stringify(messagePayload));
            const unreadKey = `room:${roomId}:unread:${receiverId}`;
            await redisClient.incr(unreadKey);
            const count = await redisClient.lLen(redisKey);

            if (count >= 30) {
              const messagesToSaveRaw = await redisClient.lRange(
                redisKey,
                0,
                14
              );
              const messagesToSave = messagesToSaveRaw.map((msg) =>
                JSON.parse(msg)
              );

              await prisma.message.createMany({ data: messagesToSave });

              await redisClient.lTrim(redisKey, 15, -1);
            }

            // Update the room's updatedAt
            await prisma.room.update({
              where: {
                id: roomId,
              },
              data: {
                updatedAt: new Date(),
              },
            });

            const senderConversations = await getConversationsForUser(userId);
            ws.send(
              JSON.stringify({
                type: "member-conversation",
                conversations: senderConversations,
              })
            );

            // Broadcast message to all room clients
            roomUsers.get(roomId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "member-new-message",
                    message: messagePayload,
                    roomId,
                  })
                );
              }
            });

            // Send updated conversation list to receiver (if online)
            const target = Array.from(connectedUsers).find(
              (client) => client.userId === receiverId
            );

            if (target) {
              const receiverConversations = await getConversationsForUser(
                receiverId
              );
              target.send(
                JSON.stringify({
                  type: "member-conversation",
                  conversations: receiverConversations,
                })
              );
            }

            break;
          }

          case "member-conversation": {
            const conversations = await prisma.room.findMany({
              where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
              },
              orderBy: { updatedAt: "desc" },
              include: {
                user1: {
                  select: { id: true, fullName: true, profileImage: true },
                },
                user2: {
                  select: { id: true, fullName: true, profileImage: true },
                },
              },
            });

            const connectedUserIds = Array.from(connectedUsers)
              .map((ws) => ws.userId)
              .filter((id) => id !== undefined);

            const formattedConversations = await Promise.all(
              conversations.map(async (room) => {
                const partner =
                  room.user1Id === userId ? room.user2 : room.user1;
                const isActive = connectedUserIds.includes(
                  partner?.id as string
                );

                const redisKey = `room:${room.id}:messages`;
                const unreadKey = `room:${room.id}:unread:${userId}`;

                // Get the latest message from Redis (most recent at the end)
                const latestRaw = await redisClient.lRange(redisKey, -1, -1);
                const latestMsg =
                  latestRaw.length > 0 ? JSON.parse(latestRaw[0]) : null;

                // Get unread count from Redis
                const unreadCountStr = await redisClient.get(unreadKey);
                const unreadCount = parseInt(unreadCountStr || "0", 10);

                const latestMessage = latestMsg
                  ? {
                      content:
                        latestMsg.content ??
                        (latestMsg.fileUrl ? "sent file" : null),
                      createdAt: latestMsg.createdAt,
                    }
                  : null;

                return {
                  roomId: room.id,
                  partner: {
                    id: partner?.id,
                    fullName: partner?.fullName,
                    profileImage: partner?.profileImage,
                    isActive,
                  },
                  lastMessage: latestMessage,
                  unreadCount,
                };
              })
            );

            ws.send(
              JSON.stringify({
                type: "member-conversation",
                conversations: formattedConversations,
              })
            );

            break;
          }

          case "group-subscribe": {
            if (!incomingGroupId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group ID is required",
                })
              );
            }

            const isGroupAvailable = await prisma.group.findUnique({
              where: {
                id: incomingGroupId,
              },
            });
            if (!isGroupAvailable) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group not found",
                })
              );
            }

            groupUsers.forEach((clients, key) => {
              if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) groupUsers.delete(key);
              }
            });

            if (!groupUsers.has(incomingGroupId)) {
              groupUsers.set(incomingGroupId, new Set());
            }
            groupUsers.get(incomingGroupId)?.add(ws);

            await redisClient.del(`group:${incomingGroupId}:unread:${userId}`);

            const redisKey = `group:${incomingGroupId}:messages`;
            const redisRaw = await redisClient.lRange(redisKey, -15, -1); // Get last 15
            const messages = redisRaw
              .reverse() // or .sort(...) if you prefer createdAt
              .map((msg) => JSON.parse(msg));

            ws.send(
              JSON.stringify({
                type: "group-messages",
                groupId: incomingGroupId,
                messages: messages,
              })
            );
            groupId = incomingGroupId;

            break;
          }

          case "group-conversation": {
            const senderConversations = await groupConversationForUser(userId);
            ws.send(
              JSON.stringify({
                type: "group-conversation",
                conversations: senderConversations,
              })
            );

            break;
          }

          case "send-group-message": {
            if (!groupId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribe any group",
                })
              );
            }

            const userInfo = await prisma.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                fullName: true,
                profileImage: true,
              },
            });

            if (!userInfo) {
              JSON.stringify({
                type: "error",
                message: "user not found",
              });
            }

            const groupInfo = await prisma.group.findUnique({
              where: { id: groupId },
            });

            if (!groupInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Group not found",
                })
              );
            }

            const messagePayload = {
              content,
              senderId: userId,
              fullName: userInfo?.fullName,
              profileImage: userInfo?.profileImage,
              groupId,
              fileUrl,
              createdAt: new Date().toISOString(),
            };

            const redisKey = `group:${groupId}:messages`;
            await redisClient.rPush(redisKey, JSON.stringify(messagePayload));
            const count = await redisClient.lLen(redisKey);

            if (count >= 30) {
              const messagesToSaveRaw = await redisClient.lRange(
                redisKey,
                0,
                14
              );
              const messagesToSave = messagesToSaveRaw.map((msg) =>
                JSON.parse(msg)
              );

              await prisma.groupMessage.createMany({
                data: messagesToSave,
              });

              await redisClient.lTrim(redisKey, 15, -1);
            }

            const pipeline = redisClient.multi();
            for (const memberId of groupInfo.memberIds) {
              if (memberId !== userId) {
                pipeline.incr(`group:${groupId}:unread:${memberId}`);
              }
            }
            await pipeline.exec();

            await prisma.group.update({
              where: {
                id: groupId,
              },
              data: {
                updatedAt: new Date(),
              },
            });

            const senderConversations = await groupConversationForUser(userId);
            ws.send(
              JSON.stringify({
                type: "group-conversation",
                conversations: senderConversations,
              })
            );

            // Broadcast message to all group clients
            groupUsers.get(groupId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "group-new-message",
                    message: messagePayload,
                    groupId,
                  })
                );
              }
            });

            const members = groupInfo.memberIds;

            for (const memberId of members) {
              const target = Array.from(connectedUsers).find(
                (c) => c.userId === memberId
              );

              if (target) {
                const conversations = await groupConversationForUser(memberId);

                target.send(
                  JSON.stringify({
                    type: "group-conversation",
                    conversations,
                  })
                );
              }
            }
            break;
          }

          default:
            ws.send(
              JSON.stringify({ type: "error", message: "Invalid message type" })
            );
        }
      } catch (err: unknown) {
        if (err instanceof SyntaxError) {
          ws.send(JSON.stringify({ type: "error", message: "Bad JSON" }));
        } else if (err instanceof Error) {
          ws.send(JSON.stringify({ type: "error", message: err }));
        } else {
          ws.send(
            JSON.stringify({ type: "error", message: "Unexpected error" })
          );
        }
      }
    });

    ws.on("close", async () => {
      connectedUsers?.delete(ws);

      if (roomId) {
        const clients = roomUsers.get(roomId);
        clients?.delete(ws);
        if (clients?.size === 0) roomUsers.delete(roomId);
      }
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss, roomUsers };
```
