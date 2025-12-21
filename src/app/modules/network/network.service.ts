import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma, UserRole, RequestStatus } from "@prisma/client";
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

//w: (start)╭──────────── getUserWithDetails ────────────╮
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
//w: (end)  ╰──────────── getUserWithDetails ────────────╯

//w: (start)╭──────────── getSuggestions ────────────╮
// Get suggestions based on user role and preference
const getSuggestionsFromDB = async (
  userId: string,
  query: RecommendationsQuery,
) => {
  const user = await getUserWithDetails(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { page, limit, filter } = query;
  const skip = (page - 1) * limit;

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
  };

  const andConditions: Prisma.UserWhereInput[] = [];

  // Apply preference filters if user has preference
  if (user.preference) {
    // Age range filter
    if (user.preference.age) {
      andConditions.push({
        profile: {
          age: {
            gte: user.preference.age.min,
            lte: user.preference.age.max,
          },
        },
      });
    }

    // Gender filter - only if user has specific gender preferences
    if (user.preference.genders && user.preference.genders.length > 0) {
      andConditions.push({
        profile: {
          gender: { in: user.preference.genders },
        },
      });
    }

    // Ethnicity filter - only if user has specific ethnicity preferences
    if (user.preference.ethnicities && user.preference.ethnicities.length > 0) {
      andConditions.push({
        profile: {
          ethnicity: { in: user.preference.ethnicities },
        },
      });
    }

    // Career/Profession filter - check for any matching career
    if (user.preference.careers && user.preference.careers.length > 0) {
      const careerOrConditions: Prisma.UserWhereInput[] = [];

      for (const career of user.preference.careers) {
        careerOrConditions.push({
          profile: {
            profession: {
              contains: career,
              mode: "insensitive" as const,
            },
          },
        });
        careerOrConditions.push({
          profile: {
            interests: {
              has: career,
            },
          },
        });
      }

      andConditions.push({
        OR: careerOrConditions,
      });
    }
  }

  if (andConditions.length > 0) {
    whereClause.AND = andConditions;
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
        status: RequestStatus.PENDING,
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
      // Age match (25 points)
      if (user.preference.age) {
        if (
          suggestion.profile.age >= user.preference.age.min &&
          suggestion.profile.age <= user.preference.age.max
        ) {
          matchPercentage += 25;
          matchReasons.push("Age matches your preference");
        }
      }

      // Gender match (25 points)
      if (user.preference.genders && user.preference.genders.length > 0) {
        if (user.preference.genders.includes(suggestion.profile.gender)) {
          matchPercentage += 25;
          matchReasons.push("Gender matches your preference");
        }
      } else {
        // Empty array means "any gender" - still give points for flexibility
        matchPercentage += 25;
        matchReasons.push("You're open to any gender");
      }

      // Ethnicity match (25 points)
      if (
        user.preference.ethnicities &&
        user.preference.ethnicities.length > 0
      ) {
        if (
          user.preference.ethnicities.includes(suggestion.profile.ethnicity)
        ) {
          matchPercentage += 25;
          matchReasons.push("Ethnicity matches your preference");
        }
      } else {
        // Empty array means "any ethnicity" - still give points for flexibility
        matchPercentage += 25;
        matchReasons.push("You're open to any ethnicity");
      }

      // Career/Profession match (25 points)
      if (user.preference.careers && user.preference.careers.length > 0) {
        let careerMatch = false;
        const lowerProfession = suggestion.profile.profession.toLowerCase();
        const lowerInterests = suggestion.profile.interests.map((i) =>
          i.toLowerCase(),
        );

        // Check if any preferred career matches profession or interests
        for (const career of user.preference.careers) {
          const lowerCareer = career.toLowerCase();
          if (
            lowerProfession.includes(lowerCareer) ||
            lowerInterests.some((interest) => interest.includes(lowerCareer))
          ) {
            careerMatch = true;
            break;
          }
        }

        if (careerMatch) {
          matchPercentage += 25;
          matchReasons.push("Career/interest matches your preference");
        }
      } else {
        // Empty array means "any career" - still give points for flexibility
        matchPercentage += 25;
        matchReasons.push("You're open to any career");
      }
    }

    // Cap match percentage at 100%
    matchPercentage = Math.min(matchPercentage, 100);

    return {
      ...suggestion,
      matchPercentage,
      matchReasons,
    };
  });

  // Sort by match percentage (highest first), then by newest
  suggestionsWithMatch.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    // If same match percentage, sort by newest
    return 0;
  });

  console.log(
    "Where clause for suggestions:",
    JSON.stringify(whereClause, null, 2),
  );
  console.log(
    `Found ${suggestionsWithMatch.length} suggestions for user ${userId}`,
  );

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
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── sendConnectionRequest ────────────╮
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

  const oppositeRole = sender.role === "MENTOR" ? "MENTEE" : "MENTOR";

  if (sender.role === receiver.role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can connect with only ${oppositeRole}`,
    );
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
      status: RequestStatus.PENDING,
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
//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequests ────────────╮
// Get pending requests (sent and received)
const getPendingRequests = async (userId: string, query: PaginationInput) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Get both sent and received pending requests
  const whereClause: Prisma.ConnectionRequestWhereInput = {
    OR: [
      { senderId: userId, status: RequestStatus.PENDING },
      { receiverId: userId, status: RequestStatus.PENDING },
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

  // Format response to indicate if it's sent or received
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
//w: (end)  ╰──────────── getPendingRequests ────────────╯

//w: (start)╭──────────── updateRequestStatus ────────────╮
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

  if (request.status !== RequestStatus.PENDING) {
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
    if (payload.status === RequestStatus.ACCEPTED) {
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
//w: (end)  ╰──────────── updateRequestStatus ────────────╯

//w: (start)╭──────────── getConnections ────────────╮
// Get all connections
const getConnections = async (userId: string, query: PaginationInput) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

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
                ethnicity: true,
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
                ethnicity: true,
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
//w: (end)  ╰──────────── getConnections ────────────╯

//w: (start)╭──────────── getSuggestions ────────────╮
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
//w: (end)  ╰──────────── getSuggestions ────────────╯

//w: (start)╭──────────── removeConnection ────────────╮
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
//w: (end)  ╰──────────── removeConnection ────────────╯

//w: (start)╭──────────── getNetworkStats ────────────╮
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
          status: RequestStatus.PENDING,
        },
      }),
      prisma.connectionRequest.count({
        where: {
          receiverId: userId,
          status: RequestStatus.PENDING,
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
//w: (end)  ╰──────────── getNetworkStats ────────────╯

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
