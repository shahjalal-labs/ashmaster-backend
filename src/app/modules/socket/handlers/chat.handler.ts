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
