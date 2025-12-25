import { z } from "zod";

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

export const NetworkValidation = {
  sendConnectionRequest,
  responseRequestOrRemoveConnection,
};
