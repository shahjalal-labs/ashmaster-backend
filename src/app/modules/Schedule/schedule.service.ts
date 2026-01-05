import { TCreateSchedule } from "./schedule.validation";

//w: (start)╭──────────── createSchedule ────────────╮
const createSchedule = async (userId: string, paylaod: TCreateSchedule) => {
  console.log({
    userId,
    paylaod,
  });
};
//w: (end)  ╰──────────── createSchedule ────────────╯

export const ScheduleService = {
  createSchedule,
};
