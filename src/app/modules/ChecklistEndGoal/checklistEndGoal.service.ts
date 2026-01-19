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
      // sort with createdAt:desc same  as id desc
      orderBy: { id: "desc" },
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

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

//w: (end)  ╰──────────── getAllChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── getMenteeProgressCount ────────────╮
const getMenteeProgressCount = async (userId: string) => {
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

  let progress = {
    progressPercentage: "0.0",
  };

  let rawPercentage =
    totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0;

  if (rawPercentage > 100) {
    rawPercentage = 100;
  }

  progress.progressPercentage = rawPercentage.toFixed(1);

  return {
    progress,
  };
};
//w: (end)  ╰──────────── getMenteeProgressCount ────────────╯

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

  //in mentorprogress, view checklists are sorting with user checklistUpdateTracker field so it's updating when user update checklist
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

//w: (start)╭──────────── getChecklistEndGoalById ────────────╮
const getChecklistEndGoalById = async (id: string) => {
  const result = await prisma.checklistEndGoal.findUnique({
    where: {
      id,
    },
    include: {
      user: {
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
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "ChecklistEndgoal not found");
  }
  return result;
};
//w: (end)  ╰──────────── getChecklistEndGoalById ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getAllChecklistOrEndGoals,
  updateChecklistEndGoals,
  deleteChecklistEndGoals,
  getChecklistEndGoalById,
  getMenteeProgressCount,
};
