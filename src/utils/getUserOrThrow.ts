import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import prisma from "../shared/prisma";

export const findOrThrow = async (
  id: string,
  message?: string,
  model: string = "User",
) => {
  const exists = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) {
    throw new ApiError(httpStatus.NOT_FOUND, message ?? `${model} not found`);
  }
};
