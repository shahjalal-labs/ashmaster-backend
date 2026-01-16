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
  private readonly ONLINE_USERS_KEY = "chat:online:users";

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
    // Set user-specific online key with TTL (auto-cleanup)
    await redisClient.setex(`chat:online:${userId}`, 300, "true"); // 5 minutes TTL

    // Add to online users set (no TTL here, will be cleaned on server restart)
    await redisClient.sadd(this.ONLINE_USERS_KEY, userId);
  }

  async setUserOffline(userId: string): Promise<void> {
    // Remove user-specific key
    await redisClient.del(`chat:online:${userId}`);

    // Remove from online users set
    await redisClient.srem(this.ONLINE_USERS_KEY, userId);
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const result = await redisClient.get(`chat:online:${userId}`);
    return result === "true";
  }

  // Get all online users
  async getOnlineUsers(): Promise<string[]> {
    return await redisClient.smembers(this.ONLINE_USERS_KEY);
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

  // Clear the online users set (called on server start)
  async clearOnlineSet(): Promise<void> {
    // Delete the online users set
    await redisClient.del(this.ONLINE_USERS_KEY);

    // Also clean up any stale user-specific online keys
    const pattern = "chat:online:*";
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      // Filter out the set key itself
      const userKeys = keys.filter((key) => key !== this.ONLINE_USERS_KEY);
      if (userKeys.length > 0) {
        await redisClient.del(...userKeys);
      }
    }

    console.log("🧹 Cleared online users set from Redis");
  }

  // Cleanup all chat data (for testing)
  async clearAllChatData(): Promise<void> {
    const keys = await redisClient.keys("chat:*");
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }

  // Get Redis connection status
  async ping(): Promise<string> {
    return await redisClient.ping();
  }

  // Check if user is still marked as online (has valid TTL)
  async isUserReallyOnline(userId: string): Promise<boolean> {
    const ttl = await redisClient.ttl(`chat:online:${userId}`);
    return ttl > 0;
  }

  // Remove stale online users (those with expired TTL from the set)
  async cleanupStaleOnlineUsers(): Promise<void> {
    const onlineUsers = await redisClient.smembers(this.ONLINE_USERS_KEY);

    for (const userId of onlineUsers) {
      const isOnline = await this.isUserReallyOnline(userId);
      if (!isOnline) {
        await redisClient.srem(this.ONLINE_USERS_KEY, userId);
        console.log(`🧹 Removed stale user ${userId} from online set`);
      }
    }
  }

  // Update user's online status TTL (call periodically for connected users)
  async refreshUserOnlineStatus(userId: string): Promise<void> {
    await redisClient.expire(`chat:online:${userId}`, 300); // Reset to 5 minutes
  }
}

export const chatRedisService = new ChatRedisService();
