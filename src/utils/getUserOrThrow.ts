import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import prisma from "../shared/prisma";

export const findUserOrThrow = async (userId: string, model: any) => {
  const user = await prisma.model.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    ApiError(httpStatus.NOT_FOUND, "User not found");
  }
};
