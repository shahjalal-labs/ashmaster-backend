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

//w: (start)╭──────────── getMyChecklistOrEndGoals ────────────╮
const getMyChecklistOrEndGoals = async (
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

  const [result, total] = await Promise.all([
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
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

//w: (start)╭──────────── changeChecklistStatus ────────────╮
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
//w: (end)  ╰──────────── changeChecklistStatus ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
  updateChecklistEndGoals,
};
