import { ChecklistEndGoalType } from "@prisma/client";
import { z } from "zod";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoalsSchema = z
  .object({
    type: z.nativeEnum(ChecklistEndGoalType),
    title: z.string().min(4),
    description: z.string().min(10),
  })
  .strict();
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

export const ChecklistEndGoalsValidation = {
  createChecklistEndGoalsSchema,
};
