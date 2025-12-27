import { ChecklistEndGoalType } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { TCreateChecklistEndGoals } from "./checklistEndGoal.validation";

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
  picked: IPaginationOptions & { type: ChecklistEndGoalType },
) => {
  console.log(picked, "checklistEndGoal.service.ts", 25);
  const result = await prisma.checklistEndGoal.findMany({
    where: {
      userId,
      // type: filter.type,
      type: {
        equals: picked.type,
      },
    },
  });
  return result;
};
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
};
