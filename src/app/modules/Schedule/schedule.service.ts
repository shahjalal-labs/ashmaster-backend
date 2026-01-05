import prisma from "../../../shared/prisma";
import { TCreateSchedule } from "./schedule.validation";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";

//w: (start)╭──────────── createSchedule ────────────╮
const createSchedule = async (userId: string, paylaod: TCreateSchedule) => {
  try {
    await prisma.schedule.create({
      data: {
        ...paylaod,
        host: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This time slot is already booked.",
      );
    }
    throw error;
  }
};

//w: (end)  ╰──────────── createSchedule ────────────╯

//w: (start)╭──────────── mySchedule ────────────╮
const mySchedule = async (userId: string, pagination: IPaginationOptions) => {
  const whereClause: Prisma.ScheduleWhereInput = {
    OR: [
      {
        hostId: userId,
      },
      {
        guestIds: {
          has: userId,
        },
      },
    ],
  };

  const result = await prisma.schedule.findMany({
    where: whereClause,
  });
  return result;
};
//w: (end)  ╰──────────── mySchedule ────────────╯

export const ScheduleService = {
  createSchedule,
  mySchedule,
};
