## another model for better clarity rest api pattern,

## 🎮 group.controller.ts

```ts
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { GroupService } from "./group.service";
import { pick } from "../../../shared/pick";
import { paginationOptions } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = catchAsync(async (req, res) => {
  await GroupService.createGroup(req.user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Group successfully created.",
    data: null,
  });
});
//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── getGroupDetails ────────────╮
const getGroupDetails = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const group = await GroupService.getGroupDetails(groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group details fetched successfully.",
    data: group,
  });
});
//w: (end)  ╰──────────── getGroupDetails ────────────╯

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroup = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  await GroupService.updateGroup(userId, groupId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group updated successfully",
    data: null,
  });
});
//w: (end)  ╰──────────── updateGroup ────────────╯

//w: (start)╭──────────── fetchAllMembers ────────────╮
const fetchAllMembers = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const pickedPagination = pick(req.query, paginationOptions);

  const result = await GroupService.fetchAllMembers(groupId, pickedPagination);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched all members successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── fetchAllMembers ────────────╯

//w: (start)╭──────────── leaveGroup ────────────╮
const leaveGroup = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  const result = await GroupService.leaveGroup(userId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Left group successfully.",
    data: result,
  });
});
//w: (end)  ╰──────────── leaveGroup ────────────╯

//w: (start)╭──────────── findMembersToAdd ────────────╮
const findMembersToAdd = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { id: groupId } = req.params;
  const result = await GroupService.findMembersToAdd(userId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched connections to add into group",
    data: result,
  });
});
//w: (end)  ╰──────────── findMembersToAdd ────────────╯

//w: (start)╭──────────── addMembersIntoGroup ────────────╮
const addMembersIntoGroup = catchAsync(async (req, res) => {
  // const { id: userId } = req.user;
  const { memberId } = req.body;
  const { id: groupId } = req.params;
  const result = await GroupService.addMembersIntoGroup(memberId, groupId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Memeber added into group successfully",
    data: result,
  });
});
//w: (end)  ╰──────────── addMembersIntoGroup ────────────╯

export const GroupController = {
  createGroup,
  getGroupDetails,
  updateGroup,
  fetchAllMembers,
  leaveGroup,
  findMembersToAdd,
  addMembersIntoGroup,
};
```

## 🧪 group.api.hurl

```bash
# create group
POST {{port6011}}/group/create
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "title":"Data Science Mentoring",
 "groupPhoto": "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1768019205514-v4ull7jpu0e.png",
 "memberIds": ["694a39873340ac9b4e13823d"]
}

# fetch group details
GET {{port6011}}/group/6964e4e1656ea48b225e0eb4
Authorization: {{ashRaisa}}


# update group (creator only)
PATCH {{port6011}}/group/6964e4e1656ea48b225e0eb4
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}

Content-Type: application/json

{
 "title":"Data Science Mentoring"
}


# fetchAllMembers
#/ /members/groupId
GET {{port6011}}/group/members/6964e4e1656ea48b225e0eb4?page=1&limit=20
Authorization: {{ashRaisa}}


#  leave group (member only)
DELETE {{port6011}}/group/6964e4e1656ea48b225e0eb4/leave
#Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}

#  find members to add
GET {{port6011}}/group/6964e4e1656ea48b225e0eb4/find-members
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}



# addMembersIntoGroup
#/ /group/groupId
POST {{port6011}}/group/6964e4e1656ea48b225e0eb4/add-member
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "memberId":"694a39873340ac9b4e138239"
}
```

## 🛠️ group.service.ts

```ts
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TCreateGroupSchema, TUpdateGroupSchema } from "./group.validation";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../shared/paginationHelper";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: TCreateGroupSchema) => {
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
```

## 📝 group.validation.ts

```ts
import { z } from "zod";

//w: (start)╭──────────── createGroup ────────────╮

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const createGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
    memberIds: z
      .array(objectIdSchema)
      .min(1, "At least one member is required")
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "Duplicate member IDs are not allowed",
      ),
  })
  .strict();

//w: (end)  ╰──────────── createGroup ────────────╯

//w: (start)╭──────────── updateGroup ────────────╮
const updateGroupSchema = z
  .object({
    title: z.string().min(4),
    groupPhoto: z.string().url().optional(),
  })
  .strict();

export type TUpdateGroupSchema = z.infer<typeof updateGroupSchema>;

//w: (end)  ╰──────────── updateGroup ────────────╯

const addMembersIntoGroupSchema = z
  .object({
    memberId: z.string().length(24),
  })
  .strict();

export type TCreateGroupSchema = z.infer<typeof createGroupSchema>;

export const GroupValidation = {
  createGroupSchema,
  updateGroupSchema,
  addMembersIntoGroupSchema,
};
```

## 🔧 group.routes.ts

```ts
import { Router } from "express";
import auth from "../../middlewares/auth";
import config, { ENV } from "../../../config";
import { profileGuard } from "../../middlewares/profile";
import { GroupController } from "./group.controller";
import validateRequest from "../../middlewares/validateRequest";
import { GroupValidation } from "./group.validation";

const router = Router();

router.use(auth());

if (config.env === ENV.DEVELOPMENT) {
  router.use(profileGuard());
}

router.post(
  "/create",
  validateRequest(GroupValidation.createGroupSchema),
  GroupController.createGroup,
);

router.get("/:id", GroupController.getGroupDetails);

router.patch(
  "/:id",
  validateRequest(GroupValidation.updateGroupSchema),
  GroupController.updateGroup,
);

//  /members/groupId
router.get("/members/:id", GroupController.fetchAllMembers);

// /groupId/leave
router.delete("/:id/leave", GroupController.leaveGroup);

// /groupId/find-members
router.get("/:id/find-members", GroupController.findMembersToAdd);

router.post(
  "/:id/add-member",
  validateRequest(GroupValidation.addMembersIntoGroupSchema),
  GroupController.addMembersIntoGroup,
);

export const GroupRoutes = router;
```

I need to implement web socket chatting system, where personal message and group message will have, the follow is, when user connect with websocket i will send 20 chatrooms sorting with updated at desc, further chatrooms will come via rest api pagination, also i need to show in the ui room partner image, name, online status, last message, last message time for chatrooms, when user click a specific room it will enter that room and render past messages based on updatedat desc, you need to implement this properly as i donnow websocket, also i have looked my senior code where has member-subscribe event, which basically create room, and render past messages. you need to implement ioredis, when redis have 20 messages then it will send to main db. guide me with details. I am giving you screen shot of the figma for better clarification. Keep everything super simple for a beginner, and make sure everything working perfectly
