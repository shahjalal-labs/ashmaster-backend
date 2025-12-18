import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma, UserRole } from "@prisma/client";
import {
  PaginationInput,
  SendRequestInput,
  UpdateRequestStatusInput,
  RecommendationsQuery,
} from "./network.validation";
import redisClient from "../../../shared/redis";

// Cache keys
const CACHE_PREFIX = "network:";
const SUGGESTIONS_CACHE_TTL = 300; // 5 minutes
const CONNECTIONS_CACHE_TTL = 600; // 10 minutes

// Helper to get cache key
const getCacheKey = (
  userId: string,
  type: string,
  page: number,
  limit: number,
  filter?: string,
): string => {
  return `${CACHE_PREFIX}${type}:${userId}:${filter || "all"}:${page}:${limit}`;
};

// Clear cache for user
const clearUserNetworkCache = async (userId: string): Promise<void> => {
  try {
    const pattern = `${CACHE_PREFIX}*:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error("Failed to clear network cache:", error);
  }
};

// Get user with profile and preference
const getUserWithDetails = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
    },
  });
};

// Get suggestions based on user role and preference
const getSuggestionsFromDB = async (
  userId: string,
  query: RecommendationsQuery,
) => {
  const user = await getUserWithDetails(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { page, limit, skip, filter } = query;

  // Determine target role based on user role and filter
  let targetRole: UserRole | undefined;
  if (filter === "mentors") {
    targetRole = UserRole.MENTOR;
  } else if (filter === "mentees") {
    targetRole = UserRole.MENTEE;
  } else {
    targetRole =
      user.role === UserRole.MENTOR ? UserRole.MENTEE : UserRole.MENTOR;
  }

  // Build where clause for suggestions
  const whereClause: Prisma.UserWhereInput = {
    id: { not: userId },
    role: targetRole,
    profilStatus: "COMPLETE",
    AND: [],
  };

  // Apply preference filters if user has preference
  if (user.preference) {
    const preferenceConditions = [];

    // Age range filter
    if (user.preference.age) {
      preferenceConditions.push({
        profile: {
          age: {
            gte: user.preference.age.min,
            lte: user.preference.age.max,
          },
        },
      });
    }

    // Gender filter (skip if NO_ANSWER)
    if (user.preference.gender !== "NO_ANSWER") {
      preferenceConditions.push({
        profile: {
          gender: user.preference.gender,
        },
      });
    }

    // Ethnicity filter (skip if NO_ANSWER)
    if (user.preference.ethnicity !== "NO_ANSWER") {
      preferenceConditions.push({
        profile: {
          ethnicity: user.preference.ethnicity,
        },
      });
    }

    // Career/Profession filter
    if (user.preference.career) {
      preferenceConditions.push({
        OR: [
          {
            profile: {
              profession: {
                contains: user.preference.career,
                mode: "insensitive",
              },
            },
          },
          { profile: { interests: { has: user.preference.career } } },
        ],
      });
    }

    if (preferenceConditions.length > 0) {
      whereClause.AND = preferenceConditions;
    }
  }

  // Get users that the current user is already connected with or has pending requests
  const [existingConnections, pendingRequests] = await Promise.all([
    prisma.connection.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    }),
    prisma.connectionRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: "PENDING",
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    }),
  ]);

  // Get all user IDs to exclude
  const excludedUserIds = [
    ...existingConnections.map((c) =>
      c.user1Id === userId ? c.user2Id : c.user1Id,
    ),
    ...pendingRequests.map((r) =>
      r.senderId === userId ? r.receiverId : r.senderId,
    ),
  ];

  if (excludedUserIds.length > 0) {
    whereClause.id = {
      not: {
        in: excludedUserIds,
      },
    };
  }

  // Get total count
  const total = await prisma.user.count({ where: whereClause });

  // Get paginated suggestions
  const suggestions = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
      profile: {
        select: {
          about: true,
          age: true,
          profession: true,
          experienceYear: true,
          profileImage: true,
          interests: true,
          gender: true,
          ethnicity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  // Calculate match percentage based on preference
  const suggestionsWithMatch = suggestions.map((suggestion) => {
    let matchPercentage = 0;
    let matchReasons: string[] = [];

    if (user.preference && suggestion.profile) {
      // Age match
      if (user.preference.age) {
        if (
          suggestion.profile.age >= user.preference.age.min &&
          suggestion.profile.age <= user.preference.age.max
        ) {
          matchPercentage += 25;
          matchReasons.push("Age matches your preference");
        }
      }

      // Gender match
      if (
        user.preference.gender !== "NO_ANSWER" &&
        user.preference.gender === suggestion.profile.gender
      ) {
        matchPercentage += 25;
        matchReasons.push("Gender matches your preference");
      }

      // Ethnicity match
      if (
        user.preference.ethnicity !== "NO_ANSWER" &&
        user.preference.ethnicity === suggestion.profile.ethnicity
      ) {
        matchPercentage += 25;
        matchReasons.push("Ethnicity matches your preference");
      }

      // Career/Profession match
      if (user.preference.career) {
        const lowerCareer = user.preference.career.toLowerCase();
        const lowerProfession = suggestion.profile.profession.toLowerCase();
        const lowerInterests = suggestion.profile.interests.map((i) =>
          i.toLowerCase(),
        );

        if (
          lowerProfession.includes(lowerCareer) ||
          lowerInterests.some((interest) => interest.includes(lowerCareer))
        ) {
          matchPercentage += 25;
          matchReasons.push("Career/interest matches your preference");
        }
      }
    }

    return {
      ...suggestion,
      matchPercentage,
      matchReasons,
    };
  });

  // Sort by match percentage (highest first)
  suggestionsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: suggestionsWithMatch,
    userRole: user.role,
    targetRole,
  };
};

// Send connection request
const sendConnectionRequest = async (
  senderId: string,
  payload: SendRequestInput,
) => {
  // Check if sender and receiver exist
  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: senderId } }),
    prisma.user.findUnique({ where: { id: payload.receiverId } }),
  ]);

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if users are already connected
  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { user1Id: senderId, user2Id: payload.receiverId },
        { user1Id: payload.receiverId, user2Id: senderId },
      ],
    },
  });

  if (existingConnection) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already connected");
  }

  // Check if there's a pending request
  const existingRequest = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId: payload.receiverId },
        { senderId: payload.receiverId, receiverId: senderId },
      ],
      status: "PENDING",
    },
  });

  if (existingRequest) {
    if (existingRequest.senderId === senderId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Request already sent");
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You have a pending request from this user",
      );
    }
  }

  // Create connection request
  const request = await prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId: payload.receiverId,
      message: payload.message,
    },
  });

  // Clear cache for both users
  await Promise.all([
    clearUserNetworkCache(senderId),
    clearUserNetworkCache(payload.receiverId),
  ]);

  return request;
};

// Get pending requests (sent and received)
const getPendingRequests = async (userId: string, query: PaginationInput) => {
  const { page, limit, skip } = query;

  const whereClause = {
    OR: [
      { senderId: userId, status: "PENDING" },
      { receiverId: userId, status: "PENDING" },
    ],
  };

  const [requests, total] = await Promise.all([
    prisma.connectionRequest.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.connectionRequest.count({ where: whereClause }),
  ]);

  // Format response
  const formattedRequests = requests.map((request) => ({
    ...request,
    isSentByMe: request.senderId === userId,
    otherUser: request.senderId === userId ? request.receiver : request.sender,
  }));

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: formattedRequests,
  };
};

// Update request status (accept/reject)
const updateRequestStatus = async (
  userId: string,
  payload: UpdateRequestStatusInput,
) => {
  const request = await prisma.connectionRequest.findUnique({
    where: { id: payload.requestId },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.receiverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update requests sent to you",
    );
  }

  if (request.status !== "PENDING") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request is already processed");
  }

  // Start transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update request status
    const updatedRequest = await tx.connectionRequest.update({
      where: { id: payload.requestId },
      data: { status: payload.status },
    });

    // If accepted, create connection
    if (payload.status === "ACCEPTED") {
      // Determine order of user IDs for consistent connection storage
      const [user1Id, user2Id] = [request.senderId, request.receiverId].sort();

      await tx.connection.create({
        data: {
          user1Id,
          user2Id,
        },
      });
    }

    return updatedRequest;
  });

  // Clear cache for both users
  await Promise.all([
    clearUserNetworkCache(request.senderId),
    clearUserNetworkCache(request.receiverId),
  ]);

  return result;
};

// Get all connections
const getConnections = async (userId: string, query: PaginationInput) => {
  const { page, limit, skip } = query;

  const cacheKey = getCacheKey(userId, "connections", page, limit);

  // Try to get from cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Get connections where user is either user1 or user2
  const whereClause = {
    OR: [{ user1Id: userId }, { user2Id: userId }],
  };

  const [connections, total] = await Promise.all([
    prisma.connection.findMany({
      where: whereClause,
      include: {
        user1: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
                experienceYear: true,
                about: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
                experienceYear: true,
                about: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.connection.count({ where: whereClause }),
  ]);

  // Format response - get the other user
  const formattedConnections = connections.map((connection) => ({
    ...connection,
    otherUser:
      connection.user1Id === userId ? connection.user2 : connection.user1,
    connectedSince: connection.createdAt,
  }));

  const result = {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: formattedConnections,
  };

  // Cache the result
  try {
    await redisClient.setex(
      cacheKey,
      CONNECTIONS_CACHE_TTL,
      JSON.stringify(result),
    );
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return result;
};

// Get suggestions with caching
const getSuggestions = async (userId: string, query: RecommendationsQuery) => {
  const { page, limit, filter } = query;
  const cacheKey = getCacheKey(userId, "suggestions", page, limit, filter);

  // Try to get from cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  // Get fresh data from DB
  const result = await getSuggestionsFromDB(userId, query);

  // Cache the result
  try {
    await redisClient.setex(
      cacheKey,
      SUGGESTIONS_CACHE_TTL,
      JSON.stringify(result),
    );
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return result;
};

// Remove connection
const removeConnection = async (userId: string, connectionId: string) => {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new ApiError(httpStatus.NOT_FOUND, "Connection not found");
  }

  if (connection.user1Id !== userId && connection.user2Id !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only remove your own connections",
    );
  }

  // Delete connection
  await prisma.connection.delete({
    where: { id: connectionId },
  });

  // Clear cache for both users
  await Promise.all([
    clearUserNetworkCache(connection.user1Id),
    clearUserNetworkCache(connection.user2Id),
  ]);

  return null;
};

// Get network stats (counts)
const getNetworkStats = async (userId: string) => {
  const cacheKey = `${CACHE_PREFIX}stats:${userId}`;

  // Try to get from cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  const [connectionsCount, sentRequestsCount, receivedRequestsCount] =
    await Promise.all([
      prisma.connection.count({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      }),
      prisma.connectionRequest.count({
        where: {
          senderId: userId,
          status: "PENDING",
        },
      }),
      prisma.connectionRequest.count({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
      }),
    ]);

  const stats = {
    connections: connectionsCount,
    sentRequests: sentRequestsCount,
    receivedRequests: receivedRequestsCount,
    totalPending: sentRequestsCount + receivedRequestsCount,
  };

  // Cache for 2 minutes
  try {
    await redisClient.setex(cacheKey, 120, JSON.stringify(stats));
  } catch (error) {
    console.error("Cache write error:", error);
  }

  return stats;
};

export const networkService = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  updateRequestStatus,
  getConnections,
  removeConnection,
  getNetworkStats,
  clearUserNetworkCache,
};
