import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import prisma from "../shared/prisma";

export const findOrThrow = async (
  id: string,
  message?: string,
  model: string = "user",
) => {
  const record = await (prisma as any)[model].findUnique({
    where: { id },
  });

  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, message || `${model} not found`);
  }

  return record;
};
