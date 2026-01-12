import httpStatus from "http-status";
import config, { ENV } from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema } from "./group.validation";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: TCreateGroupSchema) => {
  if (config.env === ENV.DEVELOPMENT) {
    const uniqueMemberIds = [...new Set(payload.memberIds)];

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueMemberIds,
        },
      },
    });
    if (users.length !== uniqueMemberIds.length)
      throw new ApiError(httpStatus.NOT_FOUND, "some of  member is not found");
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
