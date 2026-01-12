import httpStatus from "http-status";
import ApiError from "../../../../errors/ApiErrors";
import prisma from "../../../../shared/prisma";
import config, { ENV } from "../../../../config";

// Simple function to handle P2P messages
export const handleP2PMessage = async (
  senderId: string,
  receiverId: string,
  content?: string,
  fileUrl?: string[],
) => {
  try {
    // 1. Find or create a chat room between these two users

    if (senderId === receiverId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You can't send message to yourself",
      );
    }

    if (config.env === ENV.DEVELOPMENT) {
      const [sender, receiver] = await Promise.all([
        prisma.user.findUnique({
          where: {
            id: senderId,
          },
        }),
        prisma.user.findUnique({
          where: {
            id: receiverId,
          },
        }),
      ]);

      if (!sender || !receiver) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }
    }

    let room = await prisma.chatRoom.findFirst({
      where: {
        type: "P2P",
        participants: { hasEvery: [senderId, receiverId] },
      },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          type: "P2P",
          participants: [senderId, receiverId],
        },
        include: {
          messages: {
            select: {
              content: true,
              fileUrl: true,
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
      });
    }

    // 2. Save the message to database
    const message = await prisma.message.create({
      data: {
        roomId: room.id,
        senderId,
        content,
        fileUrl: fileUrl,
        readBy: [senderId],
      },
    });

    // 3. Return what we need to send to clients
    return {
      roomId: room.id,
      message,
      isNewRoom: !room.createdAt,
      room,
    };
  } catch (error) {
    console.error("❌ Failed to save message:", error);
    throw error;
  }
};

// Simple function to handle group messages
export const handleGroupMessage = async (
  senderId: string,
  groupId: string,
  content: string,
) => {
  try {
    // 1. Find or create group chat room
    let room = await prisma.chatRoom.findFirst({
      where: { type: "GROUP", groupId },
    });

    if (!room) {
      // Get group members
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!group) throw new Error("Group not found");

      room = await prisma.chatRoom.create({
        data: {
          type: "GROUP",
          groupId,
          participants: group.memberIds,
        },
      });
    }

    // 2. Save message
    const message = await prisma.message.create({
      data: {
        roomId: room.id,
        senderId,
        content,
        fileUrl: [],
        readBy: [senderId],
      },
    });

    return {
      roomId: room.id,
      message,
    };
  } catch (error) {
    console.error("❌ Failed to save group message:", error);
    throw error;
  }
};
