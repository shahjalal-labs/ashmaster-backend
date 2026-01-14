import httpStatus from "http-status";
import config, { ENV } from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema, TUpdateGroupSchema } from "./group.validation";
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

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroup = async (
  userId: string,
  groupId: string,
  payload: TUpdateGroupSchema,
) => {
  const [group, user] = await Promise.all([
    prisma.group.findUnique({
      where: {
        id: groupId,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: userId,
      },
    }),
  ]);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found");

  if (group.creatorId !== userId)
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only the creator can update the group",
    );

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: payload,
  });

  return;
};
//w: (end)  ╰──────────── updateGroup ────────────╯

const fetchAllMembers = async (userId: string, groupId: string) => {
  const result = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      id: true,
      memberIds: true,
      creatorId: true,
    },
  });

  const members = await prisma.user.findMany({
    where: {
      OR: [
        {
          id: {
            in: result?.memberIds,
          },
        },
        {
          id: result!.creatorId,
        },
      ],
    },
    select: {
      id: true,
      fullname: true,
      profile: {
        select: {
          profileImage: true,
          profession: true,
        },
      },
    },
  });
  return members;
};

export const GroupService = {
  createGroup,
  getGroupDetails,
  updateGroup,
  fetchAllMembers,
};
