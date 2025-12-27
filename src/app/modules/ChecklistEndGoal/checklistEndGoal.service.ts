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
const getMyChecklistOrEndGoals = async (userId: string, filter: any) => {
  console.log(filter, "checklistEndGoal.service.ts", 25);
  const result = await prisma.checklistEndGoal.findMany({
    where: {
      userId,
      // type: filter.type,
      type: {
        equals: filter.type,
      },
    },
    skip: 0,
  });
  return result;
};
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
};
