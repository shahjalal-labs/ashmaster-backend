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

// Helper to parse availability
const parseAvailability = (availability: any): string[] => {
  if (!availability) return [];
  if (Array.isArray(availability)) return availability;
  try {
    return JSON.parse(availability);
  } catch {
    return [];
  }
};

// Helper to check availability match
const hasMatchingAvailability = (avail1: any, avail2: any): boolean => {
  const slots1 = parseAvailability(avail1);
  const slots2 = parseAvailability(avail2);

  if (slots1.length === 0 || slots2.length === 0) return false;

  return slots1.some((slot1) =>
    slots2.some(
      (slot2) => slot1.toLowerCase().trim() === slot2.toLowerCase().trim(),
    ),
  );
};

// Get suggestions - SIMPLE and FAST
const getSuggestions = async (userId: string, query: RecommendationsQuery) => {
  const { page = 1, limit = 10, filter, search } = query;
  const skip = (page - 1) * limit;

  // Get current user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
      connectionsAsUser1: { select: { user2Id: true } },
      connectionsAsUser2: { select: { user1Id: true } },
      sentRequests: {
        where: { status: RequestStatus.PENDING },
        select: { receiverId: true },
      },
      receivedRequests: {
        where: { status: RequestStatus.PENDING },
        select: { senderId: true },
      },
    },
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // Determine target role
  let targetRole: UserRole =
    user.role === "MENTOR" ? UserRole.MENTEE : UserRole.MENTOR;
  if (filter === "mentors") targetRole = UserRole.MENTOR;
  if (filter === "mentees") targetRole = UserRole.MENTEE;

  // Collect IDs to exclude
  const excludedIds = new Set([
    userId,
    ...user.connectionsAsUser1.map((c) => c.user2Id),
    ...user.connectionsAsUser2.map((c) => c.user1Id),
    ...user.sentRequests.map((r) => r.receiverId),
    ...user.receivedRequests.map((r) => r.senderId),
  ]);

  // Build WHERE clause with proper TypeScript types
  const whereClause: Prisma.UserWhereInput = {
    id: { notIn: Array.from(excludedIds) },
    role: targetRole,
    profilStatus: "COMPLETE",
  };

  // Add search if provided
  if (search) {
    whereClause.OR = [
      { fullname: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
      {
        profile: {
          OR: [
            { profession: { contains: search, mode: "insensitive" as const } },
            { about: { contains: search, mode: "insensitive" as const } },
          ],
        },
      },
    ];
  }

  // Apply user preferences if they exist
  if (user.preference) {
    const andConditions: Prisma.UserWhereInput[] = [];

    // Age range
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

    // Gender
    if (user.preference.genders && user.preference.genders.length > 0) {
      andConditions.push({
        profile: {
          gender: { in: user.preference.genders },
        },
      });
    }

    // Ethnicity
    if (user.preference.ethnicities && user.preference.ethnicities.length > 0) {
      andConditions.push({
        profile: {
          ethnicity: { in: user.preference.ethnicities },
        },
      });
    }

    // Career - simple OR condition
    if (user.preference.careers && user.preference.careers.length > 0) {
      const careerConditions: Prisma.UserWhereInput[] =
        user.preference.careers.map((career) => ({
          OR: [
            {
              profile: {
                profession: {
                  contains: career,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              profile: {
                interests: {
                  has: career,
                },
              },
            },
          ],
        }));

      andConditions.push({
        OR: careerConditions,
      });
    }

    if (andConditions.length > 0) {
      whereClause.AND = andConditions;
    }
  }

  // Get total count
  const total = await prisma.user.count({ where: whereClause });

  // Get suggestions with pagination
  const suggestions = await prisma.user.findMany({
    where: whereClause,
    include: {
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
          availability: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  // Calculate simple match scores
  const enhancedSuggestions = suggestions.map((suggestion) => {
    let matchScore = 0;
    let hasAvailabilityMatch = false;

    // Check availability match
    if (user.profile?.availability && suggestion.profile?.availability) {
      hasAvailabilityMatch = hasMatchingAvailability(
        user.profile.availability,
        suggestion.profile.availability,
      );
    }

    // Calculate match percentage (simple version)
    if (user.preference && suggestion.profile) {
      const checks = [
        // Age (25%)
        () =>
          user.preference?.age
            ? suggestion.profile!.age >= user.preference.age.min &&
              suggestion.profile!.age <= user.preference.age.max
            : true,

        // Gender (25%)
        () =>
          user.preference?.genders && user.preference.genders.length > 0
            ? user.preference.genders.includes(suggestion.profile!.gender)
            : true,

        // Ethnicity (25%)
        () =>
          user.preference?.ethnicities && user.preference.ethnicities.length > 0
            ? user.preference.ethnicities.includes(
                suggestion.profile!.ethnicity,
              )
            : true,

        // Career/Interest (25%)
        () => {
          if (!user.preference?.careers || user.preference.careers.length === 0)
            return true;
          const lowerProfession = suggestion.profile!.profession.toLowerCase();
          const lowerInterests = suggestion.profile!.interests.map((i) =>
            i.toLowerCase(),
          );
          return user.preference.careers.some(
            (career) =>
              lowerProfession.includes(career.toLowerCase()) ||
              lowerInterests.some((interest) =>
                interest.includes(career.toLowerCase()),
              ),
          );
        },
      ];

      const passedChecks = checks.filter((check) => check()).length;
      matchScore = Math.round((passedChecks / checks.length) * 100);
    }

    return {
      id: suggestion.id,
      fullname: suggestion.fullname,
      email: suggestion.email,
      role: suggestion.role,
      profile: suggestion.profile,
      matchScore,
      hasAvailabilityMatch,
      // Simple highlight text
      highlight: hasAvailabilityMatch ? "Available times match!" : "",
    };
  });

  // Sort by: 1. Availability match, 2. Match score, 3. Newest
  enhancedSuggestions.sort((a, b) => {
    if (a.hasAvailabilityMatch !== b.hasAvailabilityMatch) {
      return a.hasAvailabilityMatch ? -1 : 1;
    }
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return 0; // Already sorted by createdAt in DB query
  });

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: enhancedSuggestions,
  };
};

// Send connection request - SIMPLE
const sendConnectionRequest = async (
  senderId: string,
  payload: SendRequestInput,
) => {
  const { receiverId, message } = payload;

  // Basic checks
  if (senderId === receiverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot send request to yourself",
    );
  }

  // Get both users
  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({
      where: { id: senderId },
      include: { profile: true },
    }),
    prisma.user.findUnique({
      where: { id: receiverId },
      include: { profile: true },
    }),
  ]);

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Role check
  if (sender.role === receiver.role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Mentors can only connect with mentees and vice versa`,
    );
  }

  // Check if already connected
  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { user1Id: senderId, user2Id: receiverId },
        { user1Id: receiverId, user2Id: senderId },
      ],
    },
  });

  if (existingConnection) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already connected");
  }

  // Check for existing pending request
  const existingRequest = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId, status: RequestStatus.PENDING },
        {
          senderId: receiverId,
          receiverId: senderId,
          status: RequestStatus.PENDING,
        },
      ],
    },
  });

  if (existingRequest) {
    const isSentByMe = existingRequest.senderId === senderId;
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      isSentByMe
        ? "Request already sent"
        : "You have a pending request from this user",
    );
  }

  // Create the request
  const request = await prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId,
      message,
    },
  });

  // Get the request with user details
  const requestWithDetails = await prisma.connectionRequest.findUnique({
    where: { id: request.id },
    include: {
      sender: {
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          profile: { select: { profileImage: true, profession: true } },
        },
      },
      receiver: {
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          profile: { select: { profileImage: true, profession: true } },
        },
      },
    },
  });

  return requestWithDetails;
};

// Get pending requests - SIMPLE
const getPendingRequests = async (userId: string, query: PaginationInput) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

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
                availability: true,
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
                availability: true,
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

// Update request status - SIMPLE
const updateRequestStatus = async (
  userId: string,
  payload: UpdateRequestStatusInput,
) => {
  const { requestId, status } = payload;

  // Find request
  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
    include: {
      sender: { include: { profile: true } },
      receiver: { include: { profile: true } },
    },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  // Authorization check
  if (request.receiverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only the receiver can accept/reject requests",
    );
  }

  if (request.status !== RequestStatus.PENDING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already processed");
  }

  // Update request
  const updatedRequest = await prisma.connectionRequest.update({
    where: { id: requestId },
    data: { status },
    include: {
      sender: {
        select: {
          id: true,
          fullname: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          fullname: true,
          role: true,
        },
      },
    },
  });

  // If accepted, create connection
  if (status === RequestStatus.ACCEPTED) {
    const [user1Id, user2Id] = [request.senderId, request.receiverId].sort();

    await prisma.connection.create({
      data: {
        user1Id,
        user2Id,
      },
    });
  }

  return updatedRequest;
};

// Get connections - SIMPLE
const getConnections = async (userId: string, query: PaginationInput) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ConnectionWhereInput = {
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
                about: true,
                availability: true,
                interests: true,
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
                about: true,
                availability: true,
                interests: true,
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

  // Format: get the other user
  const formattedConnections = connections.map((connection) => ({
    id: connection.id,
    otherUser:
      connection.user1Id === userId ? connection.user2 : connection.user1,
    connectedSince: connection.createdAt,
  }));

  return {
    meta: {
      page,
      limit,
      total,
      hasNextPage: total > skip + limit,
      hasPrevPage: page > 1,
    },
    data: formattedConnections,
  };
};

// Remove connection - SIMPLE
const removeConnection = async (userId: string, connectionId: string) => {
  // Find connection
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new ApiError(httpStatus.NOT_FOUND, "Connection not found");
  }

  // Authorization check
  if (connection.user1Id !== userId && connection.user2Id !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Can only remove your own connections",
    );
  }

  // Delete connection
  await prisma.connection.delete({
    where: { id: connectionId },
  });

  return { success: true };
};

// Get network stats - SIMPLE
const getNetworkStats = async (userId: string) => {
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

  return {
    connections: connectionsCount,
    pendingSent: sentRequestsCount,
    pendingReceived: receivedRequestsCount,
    totalPending: sentRequestsCount + receivedRequestsCount,
  };
};

export const networkService = {
  getSuggestions,
  sendConnectionRequest,
  getPendingRequests,
  updateRequestStatus,
  getConnections,
  removeConnection,
  getNetworkStats,
};
