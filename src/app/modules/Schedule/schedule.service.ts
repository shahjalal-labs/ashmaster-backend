import prisma from "../../../shared/prisma";
import { TCreateSchedule } from "./schedule.validation";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { NotificationChannel, NotificationType, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../shared/paginationHelper";
import { endOfMonth, startOfMonth } from "date-fns";
import { sendNotifToManyUser } from "../Notification/notification.service";
import { notificationQueue } from "../../../jobs/queues/notificationQueue";

//w: (start)╭──────────── createSchedule ────────────╮
const createSchedule = async (userId: string, paylaod: TCreateSchedule) => {
  try {
    const schedule = await prisma.schedule.create({
      data: {
        ...paylaod,
        host: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await notificationQueue.add("new-schedule", {
      paylaod,
      userId,
      scheduleId: schedule.id,
    });
    // Notify all guests
    await sendNotifToManyUser(
      paylaod.guestIds,
      `New Schedule: ${paylaod.title}`,
      paylaod.description,
      NotificationType.SCHEDULE,
      NotificationChannel.BOTH,
      userId,
      { scheduleId: schedule.id },
    );
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
// Allow upcoming schedules and past schedules up to 60 minutes ago
const mySchedule = async (userId: string, pagination: IPaginationOptions) => {
  const before60Min = new Date(Date.now() - 60 * 60 * 1000);
  const { skip, page, limit } =
    paginationHelper.calcalutePagination(pagination);
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
    dateTime: {
      gte: before60Min,
    },
  };

  const result = await prisma.schedule.findMany({
    where: whereClause,
    orderBy: {
      dateTime: "asc",
    },
    skip,
    take: limit,
  });

  const total = await prisma.schedule.count({
    where: whereClause,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};
//w: (end)  ╰──────────── mySchedule ────────────╯

//w: (start)╭──────────── getCurrentMonthSchedules ────────────╮
// front end will give a date then return that month full schedule for  marking the  month calendar
const getSchedulesOfMonth = async (userId: string, date: any) => {
  // const now = new Date();
  const start = startOfMonth(date);

  const end = endOfMonth(date);

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
    dateTime: {
      lte: end,
      gte: start,
    },
  };
  const result = await prisma.schedule.findMany({
    where: whereClause,
    select: {
      dateTime: true,
      id: true,
    },
  });
  return result;
};
//w: (end)  ╰──────────── getCurrentMonthSchedules ────────────╯

//w: (start)╭──────────── getScheduleDetails ────────────╮
const getScheduleDetails = async (scheduleId: string) => {
  const schedule = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: scheduleId,
    },
  });
  return schedule;
};
//w: (end)  ╰──────────── getScheduleDetails ────────────╯

export const ScheduleService = {
  createSchedule,
  mySchedule,
  getSchedulesOfMonth,
  getScheduleDetails,
};
