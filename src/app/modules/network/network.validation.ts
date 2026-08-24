import { z } from "zod";

const exploreAllQuery = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    role: z.enum(["MENTOR", "MENTEE"]).optional(),
    search: z.string().optional(),
  })
  .strict();

//w: (start)╭──────────── sendConnectionRequest ────────────╮
const sendConnectionRequest = z
  .object({
    receiverId: z.string().min(24),
    message: z.string().min(3).optional(),
  })
  .strict();

export type TSendConnectionReqest = z.infer<typeof sendConnectionRequest>;

//w: (end)  ╰──────────── sendConnectionRequest ────────────╯

//w: (start)╭──────────── responseRequest ────────────╮
const responseRequestOrRemoveConnection = z
  .object({
    requestId: z.string().min(24),
    status: z.enum(["ACCEPTED", "REJECTED", "REMOVE"]),
  })
  .strict();

export type TResponseRequest = z.infer<
  typeof responseRequestOrRemoveConnection
>;

//w: (end)  ╰──────────── responseRequest ────────────╯

//w: (start)╭──────────── respondToUser ────────────╮
const respondRequestByOtherUserId = z
  .object({
    targetUserId: z.string().min(24, "Invalid user ID format"),
    action: z.enum(["ACCEPT", "REJECT", "REMOVE"]),
  })
  .strict();

export type TRespondRequestByOtherUserId = z.infer<
  typeof respondRequestByOtherUserId
>;
//w: (end)  ╰──────────── respondToUser ────────────╯

export const NetworkValidation = {
  sendConnectionRequest,
  responseRequestOrRemoveConnection,
  respondRequestByOtherUserId,
  exploreAllQuery,
};
