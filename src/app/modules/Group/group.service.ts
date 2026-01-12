import config, { ENV } from "../../../config";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema } from "./group.validation";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: TCreateGroupSchema) => {
  if (config.env === ENV.DEVELOPMENT) {
    payload.memberIds;
  }

  await prisma.group.create({
    data: {
      ...payload,
      creatorId: userId,
    },
  });
};
//w: (end)  ╰──────────── createGroup ────────────╯

export const GroupService = {
  createGroup,
};
