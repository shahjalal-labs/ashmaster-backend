import redisClient from "../redis";
import prisma from "../prisma";

export interface IMessage {
  roomId: string;
  senderId: string;
  content?: string;
  fileUrl?: string[];
  readBy: string[];
  createdAt: Date;
  sender?: {
    id: string;
    fullname: string;
    profileImage?: string | null;
  };
}

export class ChatRedisService {
  private readonly MESSAGE_LIMIT = 20;
  private readonly ROOM_CACHE_TTL = 300; // 5 minutes

  // Store message in Redis
  async saveMessage(roomId: string, message: IMessage): Promise<void> {
    const key = `chat:${roomId}:messages`;
    await redisClient.rpush(key, JSON.stringify(message));

    // Trim to keep only last 20 messages in Redis
    const messageCount = await redisClient.llen(key);
    if (messageCount > this.MESSAGE_LIMIT) {
      // Remove oldest messages beyond limit
      await redisClient.ltrim(key, -this.MESSAGE_LIMIT, -1);
    }

    // Update room cache with last message
    await this.updateRoomCache(roomId, message);
  }

  // Get messages from Redis (newest first)
  async getMessages(roomId: string, limit: number = 50): Promise<IMessage[]> {
    const key = `chat:${roomId}:messages`;
    const messages = await redisClient.lrange(key, -limit, -1);
    return messages.reverse().map((msg) => JSON.parse(msg));
  }

  // Check if Redis has enough messages to flush to DB
  async shouldFlushToDB(roomId: string): Promise<boolean> {
    const key = `chat:${roomId}:messages`;
    const count = await redisClient.llen(key);
    return count >= this.MESSAGE_LIMIT;
  }

  // Flush messages from Redis to Database
  async flushToDatabase(roomId: string): Promise<void> {
    const key = `chat:${roomId}:messages`;
    const messages = await redisClient.lrange(key, 0, -1);

    if (messages.length === 0) return;

    // Parse messages
    const parsedMessages: IMessage[] = messages.map((msg) => JSON.parse(msg));

    // Batch insert to database
    const dbMessages = parsedMessages.map((msg) => ({
      // id: msg.id,
      roomId: msg.roomId,
      senderId: msg.senderId,
      content: msg.content,
      fileUrl: msg.fileUrl || [],
      readBy: msg.readBy,
      createdAt: msg.createdAt,
      updatedAt: msg.createdAt,
    }));

    try {
      await prisma.$transaction([
        prisma.message.createMany({
          data: dbMessages,
          // skipDuplicates: true,
        }),
      ]);

      // Clear Redis messages after successful DB write
      await redisClient.del(key);
      console.log(
        `✅ Flushed ${messages.length} messages to DB for room ${roomId}`,
      );
    } catch (error) {
      console.error("❌ Failed to flush messages to DB:", error);
      throw error;
    }
  }

  // Track online users
  async setUserOnline(userId: string): Promise<void> {
    await redisClient.set(`chat:online:${userId}`, "true", "EX", 30); // 30 seconds TTL
    await redisClient.sadd("chat:online:users", userId);
  }

  async setUserOffline(userId: string): Promise<void> {
    await redisClient.del(`chat:online:${userId}`);
    await redisClient.srem("chat:online:users", userId);
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const result = await redisClient.get(`chat:online:${userId}`);
    return result === "true";
  }

  // Get all online users
  async getOnlineUsers(): Promise<string[]> {
    return await redisClient.smembers("chat:online:users");
  }

  // Cache user's chat rooms for quick access
  async cacheUserRooms(userId: string, rooms: any[]): Promise<void> {
    await redisClient.setex(
      `chat:user:${userId}:rooms`,
      this.ROOM_CACHE_TTL,
      JSON.stringify(rooms),
    );
  }

  async getCachedRooms(userId: string): Promise<any[] | null> {
    const cached = await redisClient.get(`chat:user:${userId}:rooms`);
    return cached ? JSON.parse(cached) : null;
  }

  // Update room cache with last message
  private async updateRoomCache(
    roomId: string,
    lastMessage: IMessage,
  ): Promise<void> {
    const roomKey = `chat:room:${roomId}:info`;

    const roomInfo = {
      lastMessage: lastMessage.content,
      lastMessageTime: lastMessage.createdAt,
      lastSenderId: lastMessage.senderId,
      updatedAt: new Date(),
    };

    await redisClient.setex(
      roomKey,
      this.ROOM_CACHE_TTL,
      JSON.stringify(roomInfo),
    );
  }

  // Get room info from cache
  async getRoomInfo(roomId: string): Promise<any> {
    const roomKey = `chat:room:${roomId}:info`;
    const cached = await redisClient.get(roomKey);
    return cached ? JSON.parse(cached) : null;
  }

  // Get unread message count for a user in a room
  async getUnreadCount(roomId: string, userId: string): Promise<number> {
    const key = `chat:${roomId}:messages`;
    const messages = await redisClient.lrange(key, 0, -1);

    return messages.reduce((count, msgStr) => {
      const msg: IMessage = JSON.parse(msgStr);
      return !msg.readBy.includes(userId) ? count + 1 : count;
    }, 0);
  }

  // Mark messages as read
  async markAsRead(roomId: string, userId: string): Promise<void> {
    const key = `chat:${roomId}:messages`;
    const messages = await redisClient.lrange(key, 0, -1);

    if (messages.length === 0) return;

    const updatedMessages = messages.map((msgStr) => {
      const msg: IMessage = JSON.parse(msgStr);
      if (!msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
      }
      return JSON.stringify(msg);
    });

    // Replace the entire list
    await redisClient.del(key);
    if (updatedMessages.length > 0) {
      await redisClient.rpush(key, ...updatedMessages);
    }
  }

  // Cleanup for testing
  async clearAllChatData(): Promise<void> {
    const keys = await redisClient.keys("chat:*");
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
}

export const chatRedisService = new ChatRedisService();
