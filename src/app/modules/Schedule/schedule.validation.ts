import { z } from "zod";

//w: (start)╭──────────── createSchedule ────────────╮
const createScheduleSchema = z
  .object({
    dateTime: z.string(),
    title: z.string(),
    description: z.string(),
    guestIds: z.array(z.string().min(24)),
  })
  .strict();
//w: (end)  ╰──────────── createSchedule ────────────╯

export type TCreateSchedule = z.infer<typeof createScheduleSchema>;

export const ScheduleValidation = {
  createScheduleSchema,
};
