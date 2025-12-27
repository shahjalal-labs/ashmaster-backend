import { ChecklistEndGoalType, Status } from "@prisma/client";
import { z } from "zod";

//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoalsSchema = z
  .object({
    type: z.nativeEnum(ChecklistEndGoalType),
    title: z.string().min(4),
    description: z.string().min(10),
  })
  .strict();
export type TCreateChecklistEndGoals = z.infer<
  typeof createChecklistEndGoalsSchema
>;
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

//w: (start)╭──────────── changeChecklistStatus ────────────╮
const changeChecklistStatusSchema = z
  .object({
    status: z.nativeEnum(Status),
  })
  .strict();

export type TChangeChecklistStatusSchema = z.infer<
  typeof changeChecklistStatusSchema
>;

//w: (end)  ╰──────────── changeChecklistStatus ────────────╯

export const ChecklistEndGoalsValidation = {
  createChecklistEndGoalsSchema,
  changeChecklistStatusSchema,
};
