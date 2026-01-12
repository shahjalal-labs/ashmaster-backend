import { z } from "zod";

//w: (start)╭──────────── createGroup ────────────╮
const createGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
    memberIds: z.array(z.string().min(24)),
  })
  .strict();
//w: (end)  ╰──────────── createGroup ────────────╯

export type TCreateGroupSchema = z.infer<typeof createGroupSchema>;

export const GroupValidation = {
  createGroupSchema,
};
