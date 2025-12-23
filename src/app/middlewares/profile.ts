import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

export const profileGuard = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          profilStatus: "INCOMPLETE",
        },
      });
      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Complete profile first.");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
