import httpStatus from "http-status";
import config, { ENV } from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema } from "./group.validation";
import { group } from "console";

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

//w: (start)╭──────────── getGroupDetails ────────────╮
const getGroupDetails = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found!");
  return group;
};
//w: (end)  ╰──────────── getGroupDetails ────────────╯

export const GroupService = {
  createGroup,
  getGroupDetails,
};
