import { ChecklistEndGoalType } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { TCreateChecklistEndGoals } from "./checklistEndGoal.validation";
import { paginationHelper } from "../../../shared/paginationHelper";

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
  console.log({
    userId,
    payload,
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
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calcalutePagination(paginations);
  const result = await prisma.checklistEndGoal.findMany({
    where: {
      userId,
      type: filter.type,
    },
    skip,
    take: limit,
    orderBy:
      paginations.sortBy && sortOrder
        ? {
            [paginations.sortBy]: paginations.sortOrder,
          }
        : {
            [sortBy]: sortOrder,
          },
  });
  return {
    meta: {
      page,
      limit,

      // total: 0,
    },
    data: result,
  };
};
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
};
