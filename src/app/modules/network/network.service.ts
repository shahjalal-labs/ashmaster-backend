import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma, UserRole, RequestStatus } from "@prisma/client";

import {
  PaginationInput,
  SendRequestInput,
  UpdateRequestStatusInput,
} from "./network.validation";

const getSuggestions = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    include: {
      profile: true,
      preference: true,
    },
  });

  /* if (user.profilStatus === "INCOMPLETE") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Complete your profile");
  } */

  const pendingOrConnectedUser = [];

  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
      profilStatus: {
        not: "INCOMPLETE",
      },
      role: {
        notIn: [user.role, UserRole.ADMIN],
      },
      profile: {
        interests: {
          hasSome: user.profile?.interests,
        },
        age: {
          gte: user.preference?.age.min,
        },
      },

      /*profile: {
        interests: {
          hasSome: user.profile?.interests,
        },
        
        ethnicity: {
          in: user.preference?.ethnicities,
        },
      }, */
    },
    omit: {
      password: true,
      fcmToken: true,
      // profilStatus: true,
    },
    include: {
      profile: true,
      preference: true,
    },
  });
  return suggestedUsers;
};

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
};
