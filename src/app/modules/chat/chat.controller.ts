import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import prisma from "../../../shared/prisma";

// Get user chat rooms (for REST API pagination)
export const getChatRooms = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user.id;

  const skip = (Number(page) - 1) * Number(limit);

  // Get rooms from database with pagination
  const [rooms, total] = await Promise.all([
    prisma.chatRoom.findMany({
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
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.chatRoom.count({
      where: {
        participants: { has: userId },
      },
    }),
  ]);

  // Get online users
  const onlineUsers = await chatRedisService.getOnlineUsers();

  // Enhance rooms with partner info
  const enhancedRooms = await Promise.all(
    rooms.map(async (room) => {
      let partner = null;
      let roomName = "";
      let roomImage = null;

      if (room.type === "P2P") {
        const partnerId = room.participants.find((id) => id !== userId);
        if (partnerId) {
          const partnerUser = await prisma.user.findUnique({
            where: { id: partnerId },
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
      }

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
        lastMessage: room.messages[0]?.content,
        lastMessageTime: room.messages[0]?.createdAt || room.updatedAt,
        unreadCount,
        updatedAt: room.updatedAt,
      };
    }),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chat rooms fetched successfully",
    data: {
      rooms: enhancedRooms,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

// Get room messages (for REST API)
export const getMessages = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user.id;

  const skip = (Number(page) - 1) * Number(limit);

  // Verify access
  const room = await prisma.chatRoom.findFirst({
    where: {
      id: roomId,
      participants: { has: userId },
    },
  });

  if (!room) {
    sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "You don't have access to this room",
    });
    return;
  }

  // Get messages from both Redis and Database
  const redisMessages = await chatRedisService.getMessages(
    roomId,
    Number(limit),
  );

  let dbMessages: any[] = [];
  if (redisMessages.length < Number(limit)) {
    const needed = Number(limit) - redisMessages.length;
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
      skip: skip + redisMessages.length,
    });
  }

  // Combine messages
  const allMessages = [...redisMessages, ...dbMessages]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, Number(limit));

  // Mark as read
  await chatRedisService.markAsRead(roomId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages fetched successfully",
    data: {
      roomId,
      messages: allMessages,
      hasMore: allMessages.length >= Number(limit),
    },
  });
});

// Mark messages as read via REST
export const markAsRead = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  await chatRedisService.markAsRead(roomId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages marked as read",
    data: null,
  });
});

export const ChatController = {
  getChatRooms,
  getMessages,
  markAsRead,
};
