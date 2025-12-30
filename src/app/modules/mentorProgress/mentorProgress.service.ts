import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

//w: (start)╭──────────── getMentorProgress ────────────╮
const getMentorProgress = async (
  mentorId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" } = {},
) => {
  // Check if user is a mentor
  const mentor = await prisma.user.findUnique({
    where: { id: mentorId },
    select: { id: true, role: true },
  });

  if (!mentor || mentor.role !== "MENTOR") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only mentors can access this resource.",
    );
  }

  // Calculate pagination
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calcalutePagination(paginations);

  // Get all accepted connections where mentor is involved
  const acceptedConnections = await prisma.connections.findMany({
    where: {
      OR: [
        { senderId: mentorId, status: "ACCEPTED" },
        { receiverId: mentorId, status: "ACCEPTED" },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  // Extract mentee IDs from connections
  const menteeIds = acceptedConnections.map((conn) =>
    conn.senderId === mentorId ? conn.receiverId : conn.senderId,
  );

  // Get mentee view history for this mentor
  const viewedMentees = await prisma.mentorMenteeView.findMany({
    where: { mentorId },
    select: { menteeId: true, viewedAt: true },
  });

  const viewedMenteeIds = new Set(viewedMentees.map((v) => v.menteeId));

  // Base WHERE clause for mentees with checklists
  const whereClause: Prisma.UserWhereInput = {
    id: { in: menteeIds },
    role: "MENTEE",
    checklistEndGoal: {
      some: {
        type: filter.type || "CHECKLIST",
      },
    },
  };

  // Get total count of mentees with checklists (for progress calculation)
  const totalMenteesWithChecklists = await prisma.user.count({
    where: whereClause,
  });

  // Calculate progress percentage
  const viewedMenteesCount = await prisma.user.count({
    where: {
      ...whereClause,
      id: { in: Array.from(viewedMenteeIds) },
    },
  });

  const progressPercentage =
    totalMenteesWithChecklists > 0
      ? Math.round((viewedMenteesCount / totalMenteesWithChecklists) * 100)
      : 0;

  // Prepare sorting - Database level sorting
  let orderBy: Prisma.UserOrderByWithRelationInput = {};

  // Default sorting: Unviewed first, then by last checklist update
  if (sortBy === "viewed") {
    // Custom sort: We'll handle this after query since it needs conditional logic
    orderBy = { createdAt: "desc" };
  } else if (sortBy === "lastUpdate") {
    // This requires a join, we'll handle differently
    orderBy = { createdAt: "desc" };
  } else {
    // Default sort by name
    orderBy = { fullname: sortOrder || "asc" };
  }

  // Get paginated mentees with their checklists
  const mentees = await prisma.user.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy,
    include: {
      profile: {
        select: {
          profession: true,
          profileImage: true,
        },
      },
      checklistEndGoal: {
        where: {
          type: filter.type || "CHECKLIST",
        },
        orderBy: { updatedAt: "desc" },
        take: 1, // Get only the latest checklist for lastUpdate
      },
    },
  });

  // Get view timestamps for these mentees
  const menteeViewData = await prisma.mentorMenteeView.findMany({
    where: {
      mentorId,
      menteeId: { in: mentees.map((m) => m.id) },
    },
    select: { menteeId: true, viewedAt: true },
  });

  // Create a map for quick lookup
  const viewDataMap = new Map(
    menteeViewData.map((v) => [v.menteeId, v.viewedAt]),
  );

  // Format response with view status
  const menteeList = mentees.map((mentee) => {
    const viewedAt = viewDataMap.get(mentee.id);
    const lastChecklist = mentee.checklistEndGoal[0]; // Already sorted by updatedAt desc

    return {
      id: mentee.id,
      fullname: mentee.fullname,
      email: mentee.email,
      field: mentee.profile?.profession || "Not specified",
      profileImage: mentee.profile?.profileImage,
      totalChecklists: mentee.checklistEndGoal.length,
      completedChecklists: 0, // We'd need to count this separately if needed
      viewed: !!viewedAt,
      viewedAt: viewedAt || null,
      lastChecklistUpdate: lastChecklist?.updatedAt || null,
    };
  });

  // Apply client-side sorting only for custom logic
  if (sortBy === "viewed") {
    menteeList.sort((a, b) => {
      // Unviewed first, then viewed
      if (a.viewed !== b.viewed) {
        return a.viewed ? 1 : -1;
      }
      // Then by last update date
      if (a.lastChecklistUpdate && b.lastChecklistUpdate) {
        return (
          new Date(b.lastChecklistUpdate).getTime() -
          new Date(a.lastChecklistUpdate).getTime()
        );
      }
      return 0;
    });
  }

  // Get total count for pagination meta (different from totalMenteesWithChecklists)
  const totalMentees = await prisma.user.count({
    where: whereClause,
  });

  return {
    progress: progressPercentage,
    viewedCount: viewedMenteesCount,
    totalCount: totalMenteesWithChecklists,
    data: menteeList,
    meta: {
      page,
      limit,
      total: totalMentees,
      totalPages: Math.ceil(totalMentees / limit),
    },
  };
};
//w: (end)  ╰──────────── getMentorProgress ────────────╯

//w: (start)╭──────────── getMenteeDetailsWithChecklists ────────────╮
const getMenteeDetailsWithChecklists = async (
  mentorId: string,
  menteeId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" } = {},
) => {
  // Verify connection exists
  const connection = await prisma.connections.findFirst({
    where: {
      OR: [
        { senderId: mentorId, receiverId: menteeId, status: "ACCEPTED" },
        { senderId: menteeId, receiverId: mentorId, status: "ACCEPTED" },
      ],
    },
  });

  if (!connection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You are not connected with this mentee.",
    );
  }

  // Mark as viewed when accessing details
  await prisma.mentorMenteeView.upsert({
    where: {
      mentorId_menteeId: {
        mentorId,
        menteeId,
      },
    },
    update: {
      viewedAt: new Date(),
    },
    create: {
      mentorId,
      menteeId,
    },
  });

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calcalutePagination(paginations);

  // Get mentee details
  const mentee = await prisma.user.findUnique({
    where: { id: menteeId },
    include: {
      profile: true,
    },
  });

  if (!mentee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mentee not found.");
  }

  // Build WHERE clause for checklists
  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId: menteeId,
    ...(filter.type && { type: filter.type }),
  };

  // Determine sort order
  let orderBy: Prisma.ChecklistEndGoalOrderByWithRelationInput = {};
  if (sortBy) {
    orderBy = { [sortBy]: sortOrder || "asc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  // Get paginated checklists
  const [checklists, total] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

  // Get checklist stats
  const [totalChecklists, completedChecklists] = await Promise.all([
    prisma.checklistEndGoal.count({
      where: {
        userId: menteeId,
        type: "CHECKLIST",
      },
    }),
    prisma.checklistEndGoal.count({
      where: {
        userId: menteeId,
        type: "CHECKLIST",
        status: "COMPLETE",
      },
    }),
  ]);

  return {
    mentee: {
      id: mentee.id,
      fullname: mentee.fullname,
      email: mentee.email,
      field: mentee.profile?.profession,
      profileImage: mentee.profile?.profileImage,
      checklistStats: {
        total: totalChecklists,
        completed: completedChecklists,
        progress:
          totalChecklists > 0
            ? Math.round((completedChecklists / totalChecklists) * 100)
            : 0,
      },
    },
    data: checklists,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
//w: (end)  ╰──────────── getMenteeDetailsWithChecklists ────────────╯

//w: (start)╭──────────── markMenteeAsViewed ────────────╮
const markMenteeAsViewed = async (mentorId: string, menteeId: string) => {
  // Verify connection
  const connection = await prisma.connections.findFirst({
    where: {
      OR: [
        { senderId: mentorId, receiverId: menteeId, status: "ACCEPTED" },
        { senderId: menteeId, receiverId: mentorId, status: "ACCEPTED" },
      ],
    },
  });

  if (!connection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You are not connected with this mentee.",
    );
  }

  // Check if mentee has checklists
  const checklistCount = await prisma.checklistEndGoal.count({
    where: {
      userId: menteeId,
      type: "CHECKLIST",
    },
  });

  if (checklistCount === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This mentee has no checklists to view.",
    );
  }

  // Create or update view record
  await prisma.mentorMenteeView.upsert({
    where: {
      mentorId_menteeId: {
        mentorId,
        menteeId,
      },
    },
    update: {
      viewedAt: new Date(),
    },
    create: {
      mentorId,
      menteeId,
    },
  });

  return null;
};
//w: (end)  ╰──────────── markMenteeAsViewed ────────────╯

//w: (start)╭──────────── getUnviewedMenteesCount ────────────╮
const getUnviewedMenteesCount = async (mentorId: string) => {
  // Get all accepted connections
  const acceptedConnections = await prisma.connections.findMany({
    where: {
      OR: [
        { senderId: mentorId, status: "ACCEPTED" },
        { receiverId: mentorId, status: "ACCEPTED" },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  // Extract mentee IDs
  const menteeIds = acceptedConnections.map((conn) =>
    conn.senderId === mentorId ? conn.receiverId : conn.senderId,
  );

  // Get mentees with checklists
  const menteesWithChecklists = await prisma.user.count({
    where: {
      id: { in: menteeIds },
      role: "MENTEE",
      checklistEndGoal: {
        some: { type: "CHECKLIST" },
      },
    },
  });

  // Get viewed mentee IDs
  const viewedMentees = await prisma.mentorMenteeView.findMany({
    where: { mentorId },
    select: { menteeId: true },
  });

  const viewedMenteeIds = new Set(viewedMentees.map((v) => v.menteeId));

  // Get unviewed count by comparing counts
  const viewedCount = await prisma.user.count({
    where: {
      id: { in: Array.from(viewedMenteeIds) },
      role: "MENTEE",
      checklistEndGoal: {
        some: { type: "CHECKLIST" },
      },
    },
  });

  return menteesWithChecklists - viewedCount;
};
//w: (end)  ╰──────────── getUnviewedMenteesCount ────────────╯

export const MentorProgressService = {
  getMentorProgress,
  getMenteeDetailsWithChecklists,
  markMenteeAsViewed,
  getUnviewedMenteesCount,
};
