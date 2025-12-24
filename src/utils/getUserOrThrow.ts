import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import prisma from "../shared/prisma";

export const findOrThrow = async (
  id: string,
  message?: string,
  model: string = "user",
) => {
  const record = await (prisma as any)[model].count({
    where: { id },
  });

  if (record < 1) {
    throw new ApiError(httpStatus.NOT_FOUND, message || `${model} not found`);
  }
};
