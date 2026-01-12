import prisma from "../../../../shared/prisma";

// Simple function to handle P2P messages
export const handleP2PMessage = async (
  senderId: string,
  receiverId: string,
  content?: string,
  fileUrl?: string[],
) => {
  try {
    // 1. Find or create a chat room between these two users
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
