import prisma from "../../../shared/prisma";
import { Prisma, UserRole } from "@prisma/client";

import { paginationHelper, TOptions } from "../../../shared/paginationHelper";

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
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
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
const sendConnectionRequest = async (userId: string, receiverId: string) => {
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
    }),
  ]);
};

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

export const NetworkService = {
  getSuggestions,
  sendConnectionRequest,
};
