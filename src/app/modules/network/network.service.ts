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

const suggestions = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
  if (user.profilStatus === "INCOMPLETE") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Complete your profile");
  }

  const pendingOrConnectedUser = [];

  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
      profilStatus: {
        not: "INCOMPLETE",
      },
      profile: {},
    },
    include: {
      profile: true,
      preference: true,
    },
  });
};

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

// SIMPLE LOGIC: Get suggestions where at least ONE interest matches
const getSuggestions = async (userId: string, query: RecommendationsQuery) => {
  const { page = 1, limit = 10, filter } = query;
  const skip = (page - 1) * limit;

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
    },
  });

  if (!user || !user.profile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please complete your profile first",
    );
  }

  if (!user.preference) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please set your preferences first",
    );
  }

  // Determine target role
  let targetRole: UserRole =
    user.role === "MENTOR" ? UserRole.MENTEE : UserRole.MENTOR;
  if (filter === "mentors") targetRole = UserRole.MENTOR;
  if (filter === "mentees") targetRole = UserRole.MENTEE;

  // Build WHERE clause - MUST MATCH ALL preferences (AND operator)
  const whereClause: Prisma.UserWhereInput = {
    role: targetRole,
    profilStatus: "COMPLETE",
    id: { not: userId }, // Exclude self
  };

  // Apply AND conditions for ALL preferences
  const andConditions: Prisma.UserWhereInput[] = [];

  // 1. AGE MATCH (REQUIRED)
  andConditions.push({
    profile: {
      age: {
        gte: user.preference.age.min,
        lte: user.preference.age.max,
      },
    },
  });

  // 2. GENDER MATCH (REQUIRED - if gender preferences exist)
  if (user.preference.genders && user.preference.genders.length > 0) {
    andConditions.push({
      profile: {
        gender: { in: user.preference.genders },
      },
    });
  }

  // 3. ETHNICITY MATCH (REQUIRED - if ethnicity preferences exist)
  if (user.preference.ethnicities && user.preference.ethnicities.length > 0) {
    andConditions.push({
      profile: {
        ethnicity: { in: user.preference.ethnicities },
      },
    });
  }

  // 4. CAREER/INTEREST MATCH (REQUIRED - MUST have at least ONE match)
  // Using AND operator: check if any of user's preferred careers matches
  // the other user's profession OR any of their interests
  if (user.preference.careers && user.preference.careers.length > 0) {
    const careerOrConditions: Prisma.UserWhereInput[] = [];

    // Check each preferred career
    user.preference.careers.forEach((career) => {
      careerOrConditions.push({
        profile: {
          OR: [
            { profession: { contains: career, mode: "insensitive" as const } },
            { interests: { has: career } },
          ],
        },
      });
    });

    // AT LEAST ONE career must match (using OR between careers)
    andConditions.push({
      OR: careerOrConditions,
    });
  }

  // Add AND conditions
  whereClause.AND = andConditions;

  // Get total count
  const total = await prisma.user.count({ where: whereClause });

  // Get suggestions
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
    skip,
    take: limit,
  });

  // Check availability match and calculate match score
  const enhancedSuggestions = await Promise.all(
    suggestions.map(async (suggestion) => {
      if (!suggestion.profile) return null;

      // Check if already connected or pending
      const [existingConnection, existingRequest] = await Promise.all([
        prisma.connection.findFirst({
          where: {
            OR: [
              { user1Id: userId, user2Id: suggestion.id },
              { user1Id: suggestion.id, user2Id: userId },
            ],
          },
        }),
        prisma.connectionRequest.findFirst({
          where: {
            OR: [
              {
                senderId: userId,
                receiverId: suggestion.id,
                status: "PENDING",
              },
              {
                senderId: suggestion.id,
                receiverId: userId,
                status: "PENDING",
              },
            ],
          },
        }),
      ]);

      // Skip if already connected or pending
      if (existingConnection || existingRequest) {
        return null;
      }

      // Check availability match
      const hasAvailabilityMatch = hasMatchingAvailability(
        user.profile.availability,
        suggestion.profile.availability,
      );

      // Calculate match score based on preferences
      let matchScore = 0;

      // Age match (25 points)
      if (
        suggestion.profile.age >= user.preference.age.min &&
        suggestion.profile.age <= user.preference.age.max
      ) {
        matchScore += 25;
      }

      // Gender match (25 points)
      if (
        user.preference.genders &&
        user.preference.genders.length > 0 &&
        user.preference.genders.includes(suggestion.profile.gender)
      ) {
        matchScore += 25;
      }

      // Ethnicity match (25 points)
      if (
        user.preference.ethnicities &&
        user.preference.ethnicities.length > 0 &&
        user.preference.ethnicities.includes(suggestion.profile.ethnicity)
      ) {
        matchScore += 25;
      }

      // Career/Interest match (25 points)
      if (user.preference.careers && user.preference.careers.length > 0) {
        const lowerProfession = suggestion.profile.profession.toLowerCase();
        const lowerInterests = suggestion.profile.interests.map((i) =>
          i.toLowerCase(),
        );

        const hasCareerMatch = user.preference.careers.some((career) => {
          const lowerCareer = career.toLowerCase();
          return (
            lowerProfession.includes(lowerCareer) ||
            lowerInterests.some((interest) => interest.includes(lowerCareer))
          );
        });

        if (hasCareerMatch) {
          matchScore += 25;
        }
      }

      return {
        id: suggestion.id,
        fullname: suggestion.fullname,
        email: suggestion.email,
        role: suggestion.role,
        profile: suggestion.profile,
        matchScore,
        hasAvailabilityMatch,
        highlight: hasAvailabilityMatch ? "Available times match!" : "",
      };
    }),
  );

  // Remove null values (filtered out connections/pending)
  const filteredSuggestions = enhancedSuggestions.filter((s) => s !== null);

  // SORTING:
  // 1. First: Complete match (all preferences + availability)
  // 2. Second: Complete match without availability
  filteredSuggestions.sort((a, b) => {
    // Priority 1: Availability match
    if (a.hasAvailabilityMatch !== b.hasAvailabilityMatch) {
      return a.hasAvailabilityMatch ? -1 : 1; // a first if has availability match
    }

    // Priority 2: Higher match score
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }

    // Priority 3: Newer profiles
    return 0;
  });

  return {
    meta: {
      page,
      limit,
      total: filteredSuggestions.length,
      hasNextPage: false, // Since we filtered in memory
      hasPrevPage: page > 1,
    },
    data: filteredSuggestions,
  };
};

// Rest of the functions remain SIMPLE as before...

// Send connection request
const sendConnectionRequest = async (
  senderId: string,
  payload: SendRequestInput,
) => {
  const { receiverId, message } = payload;

  if (senderId === receiverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot send request to yourself",
    );
  }

  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: senderId } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ]);

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Role check
  if (sender.role === receiver.role) {
    const oppositeRole = sender.role === "MENTOR" ? "mentee" : "mentor";
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can only connect with ${oppositeRole}s`,
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

  // Check for pending request
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

  // Create request
  const request = await prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId,
      message,
    },
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

  return request;
};

// Get pending requests
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

// Update request status
const updateRequestStatus = async (
  userId: string,
  payload: UpdateRequestStatusInput,
) => {
  const { requestId, status } = payload;

  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.receiverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only the receiver can accept/reject requests",
    );
  }

  if (request.status !== RequestStatus.PENDING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already processed");
  }

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

// Get connections
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
      "Can only remove your own connections",
    );
  }

  await prisma.connection.delete({
    where: { id: connectionId },
  });

  return { success: true };
};

// Get network stats
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
  suggestions,
};
