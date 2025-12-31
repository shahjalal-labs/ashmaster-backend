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
const updateChecklistEndGoalsSchema = z
  .object({
    status: z.nativeEnum(Status),
    checklistId: z.string().min(24),
    title: z.string().min(4),
    description: z.string().min(10),
    type: z.nativeEnum(ChecklistEndGoalType),
  })
  .strict();

export type TChangeChecklistStatusSchema = z.infer<
  typeof updateChecklistEndGoalsSchema
>;

//w: (end)  ╰──────────── changeChecklistStatus ────────────╯

const deleteChecklistEndGoalsSchema = z.object({});

export const ChecklistEndGoalsValidation = {
  createChecklistEndGoalsSchema,
  updateChecklistEndGoalsSchema,
  deleteChecklistEndGoalsSchema,
};
