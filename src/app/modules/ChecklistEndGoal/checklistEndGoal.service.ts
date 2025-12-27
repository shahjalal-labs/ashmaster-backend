import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/paginationHelper";
import {
  TChangeChecklistStatusSchema,
  TCreateChecklistEndGoals,
} from "./checklistEndGoal.validation";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoals = async (
  userId: string,
  payload: TCreateChecklistEndGoals,
) => {
  await prisma.checklistEndGoal.create({
    data: {
      userId,
      ...payload,
    },
  });

  return;
};
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── getAllChecklistOrEndGoals ────────────╮
/* const getAllChecklistOrEndGoals = async (
  userId: string,
  paginations: IPaginationOptions,
  filter: any,
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId,
    type: filter.type,
  };

  const [result, total, totalForProgress, completed] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.checklistEndGoal.count({
      where: whereClause,
    }),

    prisma.checklistEndGoal.count({
      where: {
        userId,
        type: "CHECKLIST",
      },
    }),

    prisma.checklistEndGoal.count({
      where: {
        userId,
        type: "CHECKLIST",
        status: "COMPLETE",
      },
    }),
  ]);

  console.log(`progress`, {
    totalForProgress,
    completed,
  });

  let progress;
  if (completed !== 0) {
    progress = (completed / totalForProgress).toFixed(1);
  } else {
    progress = 0;
  }

  return {
    meta: {
      progress,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };

}; */

const getAllChecklistOrEndGoals = async (
  userId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" },
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId,
    ...(filter.type && { type: filter.type }),
  };

  const [data, total] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

  let progress: number | null = null;

  if (filter.type === "CHECKLIST") {
    const [totalChecklist, completedChecklist] = await Promise.all([
      prisma.checklistEndGoal.count({
        where: { userId, type: "CHECKLIST" },
      }),
      prisma.checklistEndGoal.count({
        where: {
          userId,
          type: "CHECKLIST",
          status: "COMPLETE",
        },
      }),
    ]);

    progress =
      totalChecklist > 0
        ? Number((completedChecklist / totalChecklist).toFixed(2))
        : 0;
  }

  return {
    meta: {
      progress,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

//w: (end)  ╰──────────── getAllChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── updateChecklistEndGoals ────────────╮
const updateChecklistEndGoals = async (
  userId: string,
  payload: TChangeChecklistStatusSchema,
) => {
  const checklist = await prisma.checklistEndGoal.findUnique({
    where: {
      id: payload.checklistId,
    },
  });
  if (!checklist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Checklist not found");
  }

  if (checklist?.userId !== userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't change ohter's checklist.",
    );
  }

  await prisma.checklistEndGoal.update({
    where: {
      id: payload.checklistId,
    },
    data: {
      status: payload.status,
      description: payload.description,
      title: payload.title,
    },
  });
};
//w: (end)  ╰──────────── updateChecklistEndGoals ────────────╯

//w: (start)╭──────────── deleteChecklistEndGoals ────────────╮
const deleteChecklistEndGoals = async (
  userId: string,
  checklistEndGoalId: string,
) => {
  const checklist = await prisma.checklistEndGoal.findUnique({
    where: {
      id: checklistEndGoalId,
    },
  });
  if (!checklist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Checklist not found");
  }

  if (checklist?.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can't delete ohter's checklist or end goals.",
    );
  }

  await prisma.checklistEndGoal.delete({
    where: {
      id: checklistEndGoalId,
    },
  });
  return null;
};
//w: (end)  ╰──────────── deleteChecklistEndGoals ────────────╯

const getChecklistEndGoalById = async () => {};

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getAllChecklistOrEndGoals,
  updateChecklistEndGoals,
  deleteChecklistEndGoals,
  getChecklistEndGoalById,
};
