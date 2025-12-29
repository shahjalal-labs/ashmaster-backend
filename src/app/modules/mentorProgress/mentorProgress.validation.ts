import { z } from "zod";

//w: (start)╭──────────── markMenteeAsViewed ────────────╮
const markMenteeAsViewedSchema = z.object({
  params: z.object({
    menteeId: z.string().min(24, "Invalid mentee ID"),
  }),
});

export type TMarkMenteeAsViewed = z.infer<typeof markMenteeAsViewedSchema>;
//w: (end)  ╰──────────── markMenteeAsViewed ────────────╯

//w: (start)╭──────────── getMenteeChecklists ────────────╮
const getMenteeChecklistsSchema = z.object({
  params: z.object({
    menteeId: z.string().min(24, "Invalid mentee ID"),
  }),
  query: z.object({
    type: z.enum(["CHECKLIST", "ENDGOALS"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
//w: (end)  ╰──────────── getMenteeChecklists ────────────╯

export const MentorProgressValidation = {
  markMenteeAsViewedSchema,
  getMenteeChecklistsSchema,
};
