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
  const checklistEndGoal = await prisma.checklistEndGoal.create({
    data: {
      userId,
      ...payload,
    },
  });

  if (payload.type === "CHECKLIST") {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        checklistUpdateTracker: new Date(),
      },
    });
  }

  console.log(checklistEndGoal, "checklistEndGoal.service.ts", 18);

  return;
};
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── getAllChecklistOrEndGoals ────────────╮
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
        ? Math.round((completedChecklist / totalChecklist) * 100)
        : 0;
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    progress,
    data,
  };
};

//w: (end)  ╰──────────── getAllChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── updateChecklistEndGoals ────────────╮
const updateChecklistEndGoals = async (
  userId: string,
  payload: TChangeChecklistStatusSchema,
) => {
  if (payload.type === "ENDGOALS" && payload.status) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Endgoals have not status to change",
    );
  }
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

  if (payload.type === "CHECKLIST") {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        checklistUpdateTracker: new Date(),
      },
    });
  }
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
