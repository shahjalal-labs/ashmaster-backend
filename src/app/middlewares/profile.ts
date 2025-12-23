import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

export const profileGuard = async () => async (req, res, next) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user && user.profilStatus === "COMPLETE") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You must complete profile to access",
    );
  }
  next();
};
