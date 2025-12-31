import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../shared/paginationHelper";
import { Prisma } from "@prisma/client";

//-- helper function
const findConnetectedMenteeIds = async (userId: string) => {
  const connections = await prisma.connections.findMany({
    where: {
      OR: [
        {
          receiverId: userId,
          status: "ACCEPTED",
        },
        {
          senderId: userId,
          status: "ACCEPTED",
        },
      ],
    },
    select: {
      id: true,
      sender: {
        select: {
          id: true,
        },
      },
      receiver: {
        select: {
          id: true,
        },
      },
    },
  });

  const connectedMenteeIds = [
    //w: ...new Set makes the array unique if anyway create's any duplicacy. Though no duplicacy will come still for better backend safety
    ...new Set(
      connections
        .flatMap((c) => [c.sender.id, c.receiver.id])
        .filter((id) => id !== userId),
    ),
  ];
  return connectedMenteeIds;
};

//w: (start)╭──────────── mentorChecklistView ────────────╮
const mentorChecklistView = async (userId: string) => {
  const mentor = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!mentor || !(mentor.role === "MENTOR")) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only mentor can view this");
  }
  const connectedMenteeIds = await findConnetectedMenteeIds(userId);

  const menteesWithChecklist = await prisma.user.findMany({
    where: {
      id: {
        in: connectedMenteeIds,
      },
      role: "MENTEE",
      checklistEndGoal: {
        some: {
          type: "CHECKLIST",
        },
      },
    },
    orderBy: {
      checklistUpdateTracker: "asc",
    },
  });
  return menteesWithChecklist;
};

//w: (end)  ╰──────────── mentorChecklistView ────────────╯

//w: (start)╭──────────── viewSpeficMenteeChecklists ────────────╮
const viewSpeficMenteeChecklists = async (
  mentorId: string,
  menteeId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" },
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId: menteeId,
    ...(filter.type && { type: filter.type }),
  };

  const [data, total] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      /* include: {
        user: {
          select: {
            fullname: true,
            id: true,
            profile: {
              select: {
                profileImage: true,
                profession: true,
              },
            },
          },
        },
      }, */
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

  if (filter?.type === "CHECKLIST") {
    await prisma.mentorMenteeView.upsert({
      where: {
        mentorId_menteeId: {
          mentorId,
          menteeId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        mentorId,
        menteeId,
      },
    });
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};
//w: (end)  ╰──────────── viewSpeficMenteeChecklists ────────────╯

//w: (start)╭──────────── mentorProgress ────────────╮
const mentorProgress = async (userId: string) => {
  const connectedMenteeIds = await findConnetectedMenteeIds(userId);

  //  Only count views from last 7 days as "valid"
  //  those are viewed in last 7 dasy are count as viewd. if any mentee don't view in last 7 dasy he wont count in viewed consequently in progress

  const viewedValidity = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  // const viewedValidity = new Date(Date.now() - 30 * 1000);

  const [totalMenteesWithChecklist, totalViewedMenteesWithChecklist] =
    await Promise.all([
      prisma.user.count({
        where: {
          id: {
            in: connectedMenteeIds,
          },
          role: "MENTEE",
          checklistEndGoal: {
            some: {
              type: "CHECKLIST",
            },
          },
        },
      }),

      await prisma.mentorMenteeView.count({
        where: {
          mentorId: userId,
          viewedAt: {
            gte: viewedValidity,
          },
        },
      }),
    ]);

  let progress = {
    progressPercentage: 0,
  };
  progress.progressPercentage =
    totalMenteesWithChecklist > 0
      ? (totalViewedMenteesWithChecklist / totalMenteesWithChecklist) * 100
      : 0;

  console.log(progress, "mentorProgress.service.ts", 177);

  return progress;
};

//w: (end)  ╰──────────── mentorProgress ────────────╯

export const MentorProgressService = {
  mentorChecklistView,
  viewSpeficMenteeChecklists,
  mentorProgress,
};
