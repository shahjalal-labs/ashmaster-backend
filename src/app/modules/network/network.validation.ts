import { z } from "zod";

const sendConnectionRequest = z.object({
  receiverId: z.string().min(24),
  uniqueKey: z.string().min(49),
  message: z.string().min(3).optional(),
});

export const NetworkValidation = {
  sendConnectionRequest,
};
