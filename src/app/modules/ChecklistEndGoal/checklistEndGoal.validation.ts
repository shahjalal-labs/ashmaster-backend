import { ChecklistEndGoalType } from "@prisma/client";
import { z } from "zod";

const createChecklistEndGoalsSchema = z.object({
  type: z.enum([ChecklistEndGoalType]),


});

export const ChecklistEndGoalsValidation = {
  createChecklistEndGoalsSchema,
};
