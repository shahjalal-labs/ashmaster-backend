import prisma from "../../../shared/prisma";
import { Prisma, RequestStatus, UserRole } from "@prisma/client";

import { paginationHelper, TOptions } from "../../../shared/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TSendConnectionReqest } from "./network.validation";

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

  const pendingOrConnectedUser = [];
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
      not: userId,
    },
    profilStatus: {
      not: "INCOMPLETE",
    },
    role: {
      // mentee will get mentor and mentor will get mentee only
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
  const suggestedUsers = await prisma.user.findMany({
    /*  {
           id: {
        not: userId,
      },
      profilStatus: {
        not: "INCOMPLETE",
      },
      role: {
        // mentee will get mentor and mentor will get mentee only
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
    },  */
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
  });

  const total = await prisma.user.count({
    where: whereClause,
  });

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

  await prisma.connections.create({
    data: {
      senderId: userId,
      receiverId,
      uniqueKey,
      message,
    },
  });
};

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

export const NetworkService = {
  getSuggestions,
  sendConnectionRequest,
};
