import { z } from "zod";
import { RequestStatus } from "@prisma/client";

// Pagination validation
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Send connection request
const sendRequestSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  message: z
    .string()
    .max(500, "Message must be at most 500 characters")
    .optional(),
});

// Update request status
const updateRequestStatusSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  status: z.nativeEnum(RequestStatus, {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SendRequestInput = z.infer<typeof sendRequestSchema>;
export type UpdateRequestStatusInput = z.infer<
  typeof updateRequestStatusSchema
>;

export const networkValidation = {
  paginationSchema,
  sendRequestSchema,
  updateRequestStatusSchema,
};
