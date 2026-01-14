import { z } from "zod";

//w: (start)╭──────────── createGroup ────────────╮

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const createGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
    memberIds: z
      .array(objectIdSchema)
      .min(1, "At least one member is required")
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate member IDs are not allowed",
      ),
  })
  .strict();

//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
  })
  .strict();

export type TUpdateGroupSchema = z.infer<typeof updateGroupSchema>;

//w: (end)  ╰──────────── updateGroup ────────────╯

export type TCreateGroupSchema = z.infer<typeof createGroupSchema>;

export const GroupValidation = {
  createGroupSchema,
  updateGroupSchema,
};
