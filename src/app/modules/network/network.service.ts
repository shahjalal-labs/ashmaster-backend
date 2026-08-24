import prisma from "../../../shared/prisma";
import { Prisma, ProfilStatus, UserRole } from "@prisma/client";

import { paginationHelper, TOptions } from "../../../shared/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TResponseRequest, TSendConnectionReqest } from "./network.validation";
import { notificationQueue } from "../../../jobs/queues/notificationQueue";

//w: (start)╭──────────── getSuggestions ────────────╮
const getSuggestions = async (userId: string, options: TOptions) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    include: {
      profile: true,
      preference: true,
    },
  });

  const connectedOrPendingUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          receivedRequests: {
            some: {
              senderId: userId,
            },
          },
        },
        {
          sentRequests: {
            some: {
              receiverId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const excludedIds = connectedOrPendingUsers.map((u) => u.id);
  // excludedIds.push(userId);
  const { page, limit, skip } = paginationHelper.calcalutePagination(options);

  const genderProfileFilter: Prisma.ProfileWhereInput | undefined = user
    .preference?.genders?.length
    ? {
        OR: [
          {
            gender: {
              in: user.preference.genders,
            },
          },
          {
            gender: "NO_ANSWER",
          },
        ],
      }
    : undefined; //  no filtering at all

  const whereClause: Prisma.UserWhereInput = {
    id: {
      notIn: excludedIds,
    },

    profilStatus: ProfilStatus.COMPLETE,
    role: {
      // mentee will get mentor and mentor will get mentee only, no need to see admin > it also hide own profile as role needs to be opposite
      notIn: [user.role, UserRole.ADMIN],
    },
    profile: {
      interests: {
        hasSome: user.profile?.interests,
      },
      age: {
        gte: user.preference?.age.min,
        lte: user.preference?.age.max,
      },
      ethnicity: {
        in: user.preference?.ethnicities,
      },
      profession: {
        in: user.preference?.careers,
      },
      ...(genderProfileFilter ?? {}),
    },
  };

  const [suggestedUsers, total] = await Promise.all([
    await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullname: true,
        profile: {
          select: {
            profileImage: true,
            profession: true,
          },
        },
        // preference: true,
      },

      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    await prisma.user.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    data: suggestedUsers,
  };
};
//w: (end)  ╰──────────── getSuggestions ────────────╯

// get all mentor and mentee to connect
//w: (start)╭──────────── exploreAllUsers ────────────╮
const exploreAllUsers = async (userId: string, options: any) => {
  // Extract pagination
  const { page, limit, skip } = paginationHelper.calcalutePagination(options);

  // 1. Find all users that are already connected or pending (any status)
  const connectedOrPendingUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          receivedRequests: {
            some: {
              senderId: userId,
            },
          },
        },
        {
          sentRequests: {
            some: {
              receiverId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const excludedIds = connectedOrPendingUsers.map((u) => u.id);
  excludedIds.push(userId); // also exclude self

  // 2. Build where clause
  const whereClause: Prisma.UserWhereInput = {
    id: {
      notIn: excludedIds,
    },
    role: {
      not: "ADMIN", // never show admins
    },
    profilStatus: "COMPLETE", // optional but consistent
  };

  // 3. Apply optional role filter
  if (options.role) {
    whereClause.role = options.role; // "MENTOR" or "MENTEE"
  }

  // 4. Apply optional search (by fullname)
  if (options.search) {
    whereClause.fullname = {
      contains: options.search,
      mode: "insensitive",
    };
  }

  // 5. Fetch data and total count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullname: true,
        role: true,
        profile: {
          select: {
            profileImage: true,
            profession: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    data: users,
  };
};
//w: (end)  ╰──────────── exploreAllUsers ────────────╯

//w: (start)╭──────────── sendConnectionRequest ────────────╮
const sendConnectionRequest = async (
  userId: string,
  paylaod: TSendConnectionReqest,
) => {
  const { receiverId, message } = paylaod;
  if (userId === receiverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot send a connection request to yourself.",
    );
  }

  const uniqueKey = [userId, receiverId].sort().join("_");

  const [user, receiver, existingConnection] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullname: true,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
      },
    }),

    prisma.connections.findUnique({
      where: {
        uniqueKey,
      },
      select: {
        id: true,
        status: true,
      },
    }),
  ]);

  if (!user || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User or receiver not found.");
  }

  if (existingConnection) {
    const statusErrorMap = {
      PENDING: "Connection request already sent.",
      ACCEPTED: "You are already connected.",
      // REJECTED: "Connection request was rejected and cannot be resent.",
    } as const;

    throw new ApiError(
      httpStatus.BAD_REQUEST,
      statusErrorMap[existingConnection.status],
    );
  }

  const connection = await prisma.connections.create({
    data: {
      senderId: userId,
      receiverId,
      uniqueKey,
      message,
    },
  });

  // notify the other user
  await notificationQueue.add(
    "newConnection",
    {
      receiverId,
      userId,
      fullname: user.fullname,
      requestId: connection.id,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 3600 * 2, //2h
      },
    },
  );

  //notify other user without bullmq
  /* await sendSingleNotification(
    receiverId,
    "New connection request",
    `${user.fullname} has sent you a connection request`,
    "CONNECTIONS",
    "BOTH",
    userId, // senderId
    {
      requestId: connection.id,
    },
  ); */
};

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── getPendingRequest ────────────╮
const getPendingRequest = async (userId: string, options: TOptions) => {
  const { page, skip, limit } = paginationHelper.calcalutePagination(options);

  const whereClause: Prisma.ConnectionsWhereInput = {
    receiverId: userId,
    status: "PENDING",
  };

  const [requests, total] = await Promise.all([
    prisma.connections.findMany({
      where: whereClause,
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            fullname: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.connections.count({
      where: whereClause,
    }),
  ]);

  return {
    meta: {
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    },
    data: requests,
  };
};
//w: (end)  ╰──────────── getPendingRequest ────────────╯

//w: (start)╭──────────── getConnections ────────────╮
const getConnections = async (userId: string, options: TOptions) => {
  const { page, skip, limit } = paginationHelper.calcalutePagination(options);

  const whereClause: Prisma.ConnectionsWhereInput = {
    status: "ACCEPTED",
    OR: [
      {
        senderId: userId,
      },
      {
        receiverId: userId,
      },
    ],
  };
  const [connections, total] = await Promise.all([
    prisma.connections.findMany({
      where: whereClause,
      select: {
        id: true,
        receiver: {
          select: {
            id: true,
            fullname: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
        sender: {
          select: {
            id: true,
            fullname: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        // same as createdAt:"desc" but for indexed faster query
        id: "desc",
      },
    }),

    prisma.connections.count({
      where: whereClause,
    }),
  ]);

  //  finding opposite user for front end. creating shape like this as front end already created model. for similarity backend used this pattern
  const renderIntoUiConnections = connections.map((c) => {
    const connected: any = {
      id: "",
      sender: {
        profile: {},
      },
    };
    if (c.sender.id !== userId) {
      connected.id = c.id;
      connected.sender.id = c.sender.id;
      connected.sender.fullname = c.sender.fullname;
      connected.sender.profile.profileImage = c.sender.profile?.profileImage;
      connected.sender.profile.profession = c.sender.profile?.profession;
    } else {
      connected.id = c.id;
      connected.sender.id = c.receiver.id;
      connected.sender.fullname = c.receiver.fullname;
      connected.sender.profile.profileImage = c.receiver.profile?.profileImage;
      connected.sender.profile.profession = c.receiver.profile?.profession;
    }
    return connected;
  });

  return {
    meta: {
      total,
      skip,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: renderIntoUiConnections,
  };
};
//w: (end)  ╰──────────── getConnections ────────────╯

//w: (start)╭──────────── responseRequestOrRemoveConnection ────────────╮
const responseRequestOrRemoveConnection = async (
  userId: string,
  payload: TResponseRequest,
) => {
  //  paylaod status:
  //  ACCEPTED/ REJECTED/REMOVE   // accpet/reject to response the request & remove for deletng existing connection

  const [request] = await Promise.all([
    await prisma.connections.findUnique({
      where: {
        id: payload.requestId,
      },
      select: {
        id: true,
        status: true,
        senderId: true,
        receiverId: true,
        receiver: {
          select: {
            fullname: true,
          },
        },
      },
    }),
  ]);

  if (!request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No request found");
  }

  if (request?.receiverId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You canno't response to other request",
    );
  }

  // if already accepted then throw error when tyring not to remove connection
  //p: ACCEPTED/ REJECTED/REMOVE   // accpet/reject to response the request & remove to delete existing connection or cancel sent request

  if (payload.status !== "REMOVE" && request.status === "ACCEPTED") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already responded");
  }

  if (payload.status === "ACCEPTED") {
    await prisma.connections.update({
      where: {
        id: payload.requestId,
      },
      data: {
        status: payload.status,
      },
    });

    // connectionRequest acceptance notif
    await notificationQueue.add(
      "requestAcceptance",
      {
        senderId: request.senderId,
        fullname: request.receiver.fullname,
        receiverId: request.receiverId, // notification senderid
        requestId: request.id,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          age: 3600 * 2, //2h
        },
      },
    );

    // notify the other user
    /* await sendSingleNotification(
      request.senderId, // notification receiverId
      "Connection request accepted",
      `${request.receiver.fullname} accepted your connection request`,
      "CONNECTIONS",
      "BOTH",
      request.receiverId, // notification senderid
      {
        requestId: request.id,
      },
    ); */
  } else {
    await prisma.connections.delete({
      where: {
        id: payload.requestId,
      },
    });
  }
};
//w: (end)  ╰──────────── responseRequestOrRemoveConnection ────────────╯

//w: (start)╭──────────── getMyConnectionCount ────────────╮
const getMyConnectionCount = async (userId: string) => {
  const connectionsCount = await prisma.connections.count({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          receiverId: userId,
        },
        {
          senderId: userId,
        },
      ],
    },
  });
  console.log(connectionsCount, "network.service.ts", 395);
  return {
    connectionsCount,
  };
};
//w: (end)  ╰──────────── getMyConnectionCount ────────────╯

export const NetworkService = {
  getSuggestions,
  exploreAllUsers,
  sendConnectionRequest,
  getPendingRequest,
  getConnections,
  responseRequestOrRemoveConnection,
  getMyConnectionCount,
};
