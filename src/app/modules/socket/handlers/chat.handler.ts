import httpStatus from "http-status";
import ApiError from "../../../../errors/ApiErrors";
import prisma from "../../../../shared/prisma";
import {
  chatRedisService,
  IMessage,
} from "../../../../shared/redis-services/chat.service";
import { v4 as uuidv4 } from "uuid";

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
        },
      });
      isNewRoom = true;
    }

    // Create message object
    const message: IMessage = {
      id: uuidv4(),
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
      id: uuidv4(),
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
        ...({
          include: {
            group: {
              select: {
                id: true,
                title: true,
                groupPhoto: true,
              },
            },
          },
        } as any),
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
        } else if (room.type === "GROUP" && room.groupId) {
          const group = (room as any).group;
          if (group) {
            roomName = group.title;
            roomImage = group.groupPhoto;
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
          lastMessage: lastMessage?.content,
          lastMessageTime: lastMessage?.createdAt || room.updatedAt,
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
