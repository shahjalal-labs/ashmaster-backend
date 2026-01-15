import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema, TUpdateGroupSchema } from "./group.validation";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: TCreateGroupSchema) => {
  const uniqueMemberIds = [...new Set(payload.memberIds)];

  await prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: {
        id: {
          in: uniqueMemberIds,
        },
      },
    });
    if (users.length !== uniqueMemberIds.length)
      throw new ApiError(httpStatus.NOT_FOUND, "some of  member is not found");

    const group = await tx.group.create({
      data: {
        ...payload,
        creatorId: userId,
      },
    });

    await tx.chatRoom.create({
      data: {
        type: "GROUP",
        groupId: group.id,
        participants: [...uniqueMemberIds, userId],
      },
    });
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

//w: (start)╭──────────── fetchAllMembers ────────────╮
const fetchAllMembers = async (
  groupId: string,
  paginations: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      memberIds: true,
      creatorId: true,
    },
  });

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
  }

  //merge + convert into unique ids
  const userIds = Array.from(new Set([...group.memberIds, group.creatorId]));

  const [total, members] = await Promise.all([
    // total count
    prisma.user.count({
      where: {
        id: { in: userIds },
      },
    }),
    // members
    prisma.user.findMany({
      where: {
        id: { in: userIds },
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
      skip,
      take: limit,
      // sort with createdAt:desc same  as id desc
      orderBy: { id: "desc" },
    }),
  ]);

  //Single, clean query

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: members,
  };
};

//w: (end)  ╰──────────── fetchAllMembers ────────────╯

//w: (start)╭──────────── leaveGroup ────────────╮
const leaveGroup = async (userId: string, groupId: string) => {
  // transaction to solve race conditions
  const result = await prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        creatorId: true,
        memberIds: true,
      },
    });

    if (!group) throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    if (userId === group.creatorId)
      throw new ApiError(httpStatus.BAD_REQUEST, "Creator cannot leave group");

    if (!group.memberIds.includes(userId)) {
      return group;
    }
    const remainMemberIds = group.memberIds.filter((id) => id !== userId);

    const result = await tx.group.update({
      where: {
        id: groupId,
      },
      data: {
        memberIds: remainMemberIds,
      },
    });
    return result;
  });
  return {
    id: result.id,
    memberIds: result.memberIds,
    creatorId: result.creatorId,
  };
};
//w: (end)  ╰──────────── leaveGroup ────────────╯

//w: (start)╭──────────── findMembersToAdd ────────────╮
// connected by connections and not a member in the particular group
const findMembersToAdd = async (userId: string, groupId: string) => {
  const connections = await prisma.connections.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ receiverId: userId }, { senderId: userId }],
    },
    select: {
      senderId: true,
      sender: {
        select: {
          id: true,
          fullname: true,
          profile: {
            select: {
              profession: true,
              profileImage: true,
            },
          },
        },
      },
      receiverId: true,
      receiver: {
        select: {
          id: true,
          fullname: true,
          profile: {
            select: {
              profession: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  // normalize connections → always "the other user"
  const connectedWithMe = connections.map((c) =>
    c.senderId === userId ? c.receiver : c.sender,
  );

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { memberIds: true },
  });

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
  }

  const groupMemberSet = new Set(group.memberIds);

  const connectedButNotInGroup = connectedWithMe.filter(
    (user) => !groupMemberSet.has(user.id),
  );

  return connectedButNotInGroup;
};

//w: (end)  ╰──────────── findMembersToAdd ────────────╯

//w: (start)╭──────────── addMembersIntoGroup ────────────╮
const addMembersIntoGroup = async (memberId: string, groupId: string) => {
  return prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id: groupId },
      select: { memberIds: true },
    });

    if (!group) {
      throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    }

    // already a member → no-op (idempotent)
    if (group.memberIds.includes(memberId)) {
      return group;
    }

    const updatedMembers = [...group.memberIds, memberId];

    return tx.group.update({
      where: { id: groupId },
      data: {
        memberIds: updatedMembers,
      },
      select: {
        memberIds: true,
      },
    });
  });
};

//w: (end)  ╰──────────── addMembersIntoGroup ────────────╯

export const GroupService = {
  createGroup,
  getGroupDetails,
  updateGroup,
  fetchAllMembers,
  leaveGroup,
  findMembersToAdd,
  addMembersIntoGroup,
};
