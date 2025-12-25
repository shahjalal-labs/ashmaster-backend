import prisma from "../../../shared/prisma";
import { TCreateChecklistEndGoals } from "./checklistEndGoal.validation";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoals = async (
  userId: string,
  payload: TCreateChecklistEndGoals,
) => {
  await prisma.checklistEndGoal.create({
    data: payload,
  });
  console.log({
    userId,
    payload,
  });
};
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── getMyChecklistOrEndGoals ────────────╮
const getMyChecklistOrEndGoals = async (userId: string) => {};
//w: (end)  ╰──────────── getMyChecklistOrEndGoals ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
  getMyChecklistOrEndGoals,
};
