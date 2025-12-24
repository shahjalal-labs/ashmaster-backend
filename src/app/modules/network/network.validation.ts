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

export const NetworkValidation = {
  sendConnectionRequest,
};
