import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

//w: (start)╭──────────── getMentorProgress ────────────╮
const getMentorProgress = async (mentorId: string) => {
  // Check if user is a mentor
  const mentor = await prisma.user.findUnique({
    where: { id: mentorId },
    select: {
      id: true,
      role: true,
    },
  });

  console.log(mentor, "mentorProgress.service.ts", 12);
  if (!mentor || mentor.role !== "MENTOR") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only mentors can access this resource.",
    );
  }

  // Get all accepted connections where the mentor is involved
  const connections = await prisma.connections.findMany({
    where: {
      OR: [
        { senderId: mentorId, status: "ACCEPTED" },
        { receiverId: mentorId, status: "ACCEPTED" },
      ],
    },
    include: {
      sender: {
        include: {
          profile: true,
          checklistEndGoal: {
            where: { type: "CHECKLIST" },
          },
        },
      },
      receiver: {
        include: {
          profile: true,
          checklistEndGoal: {
            where: { type: "CHECKLIST" },
          },
        },
      },
    },
  });

  // Extract mentees (users who are not the mentor)

  const mentees = connections
    .map((connection) => {
      const otherUser =
        connection.senderId === mentorId
          ? connection.receiver
          : connection.sender;
      return otherUser;
    })
    .filter((user) => user.role === "MENTEE");

  // Get mentor's view history
  const viewedMentees = await prisma.mentorMenteeView.findMany({
    where: { mentorId },
    select: { menteeId: true, viewedAt: true },
  });

  const viewedMenteeIds = new Set(viewedMentees.map((v) => v.menteeId));

  // Filter mentees who have at least one checklist
  const menteesWithChecklists = mentees.filter(
    (mentee) => mentee.checklistEndGoal && mentee.checklistEndGoal.length > 0,
  );

  // Calculate progress
  const totalMenteesWithChecklists = menteesWithChecklists.length;
  const viewedMenteesCount = menteesWithChecklists.filter((mentee) =>
    viewedMenteeIds.has(mentee.id),
  ).length;

  const progressPercentage =
    totalMenteesWithChecklists > 0
      ? Math.round((viewedMenteesCount / totalMenteesWithChecklists) * 100)
      : 0;

  // Prepare mentee list with view status
  const menteeList = menteesWithChecklists.map((mentee) => {
    const isViewed = viewedMenteeIds.has(mentee.id);
    const viewInfo = viewedMentees.find((v) => v.menteeId === mentee.id);

    return {
      id: mentee.id,
      fullname: mentee.fullname,
      email: mentee.email,
      field: mentee.profile?.profession || "Not specified",
      profileImage: mentee.profile?.profileImage,
      totalChecklists: mentee.checklistEndGoal.length,
      completedChecklists: mentee.checklistEndGoal.filter(
        (c) => c.status === "COMPLETE",
      ).length,
      viewed: isViewed,
      viewedAt: viewInfo?.viewedAt || null,
      lastChecklistUpdate:
        mentee.checklistEndGoal.length > 0
          ? mentee.checklistEndGoal.reduce(
              (latest, current) =>
                current.updatedAt > latest ? current.updatedAt : latest,
              mentee.checklistEndGoal[0].updatedAt,
            )
          : null,
    };
  });

  // Sort: unviewed first, then viewed (with latest updates first)
  menteeList.sort((a, b) => {
    // First sort by viewed status
    if (a.viewed !== b.viewed) {
      return a.viewed ? 1 : -1;
    }

    // If both viewed, sort by view date (most recently viewed first)
    if (a.viewed && b.viewed && a.viewedAt && b.viewedAt) {
      return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime();
    }

    // If both unviewed, sort by last checklist update (most recent first)
    if (
      !a.viewed &&
      !b.viewed &&
      a.lastChecklistUpdate &&
      b.lastChecklistUpdate
    ) {
      return (
        new Date(b.lastChecklistUpdate).getTime() -
        new Date(a.lastChecklistUpdate).getTime()
      );
    }

    return 0;
  });

  return {
    progress: progressPercentage,
    viewedCount: viewedMenteesCount,
    totalCount: totalMenteesWithChecklists,
    mentees: menteeList,
  };
};
//w: (end)  ╰──────────── getMentorProgress ────────────╯

//w: (start)╭──────────── markMenteeAsViewed ────────────╮
const markMenteeAsViewed = async (mentorId: string, menteeId: string) => {
  // Verify mentor-mentee connection exists and is accepted
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

  // Check if mentee has at least one checklist
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

//w: (start)╭──────────── getMenteeChecklists ────────────╮
const getMenteeChecklists = async (
  mentorId: string,
  menteeId: string,
  paginations: IPaginationOptions,
  filter: { type?: "CHECKLIST" | "ENDGOALS" },
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

  const { page, limit, skip } =
    paginationHelper.calcalutePagination(paginations);

  const whereClause: Prisma.ChecklistEndGoalWhereInput = {
    userId: menteeId,
    ...(filter.type && { type: filter.type }),
  };

  const [data, total] = await Promise.all([
    prisma.checklistEndGoal.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            profile: {
              select: {
                profession: true,
                profileImage: true,
              },
            },
          },
        },
      },
    }),
    prisma.checklistEndGoal.count({ where: whereClause }),
  ]);

  // Get mentee info
  const mentee = await prisma.user.findUnique({
    where: { id: menteeId },
    include: {
      profile: true,
    },
  });

  // Mark as viewed when mentor accesses checklists
  await markMenteeAsViewed(mentorId, menteeId);

  return {
    mentee: {
      id: mentee?.id,
      fullname: mentee?.fullname,
      email: mentee?.email,
      field: mentee?.profile?.profession,
      profileImage: mentee?.profile?.profileImage,
    },
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};
//w: (end)  ╰──────────── getMenteeChecklists ────────────╯

//w: (start)╭──────────── getUnviewedMenteesCount ────────────╮
const getUnviewedMenteesCount = async (mentorId: string) => {
  // Get all connected mentees with checklists
  const connections = await prisma.connections.findMany({
    where: {
      OR: [
        { senderId: mentorId, status: "ACCEPTED" },
        { receiverId: mentorId, status: "ACCEPTED" },
      ],
    },
    include: {
      sender: {
        include: {
          checklistEndGoal: {
            where: { type: "CHECKLIST" },
          },
        },
      },
      receiver: {
        include: {
          checklistEndGoal: {
            where: { type: "CHECKLIST" },
          },
        },
      },
    },
  });

  // Extract mentees with checklists
  const menteesWithChecklists = connections
    .map((connection) => {
      const otherUser =
        connection.senderId === mentorId
          ? connection.receiver
          : connection.sender;
      return otherUser.role === "MENTEE" &&
        otherUser.checklistEndGoal.length > 0
        ? otherUser
        : null;
    })
    .filter(Boolean);

  // Get viewed mentee IDs
  const viewedMentees = await prisma.mentorMenteeView.findMany({
    where: { mentorId },
    select: { menteeId: true },
  });

  const viewedMenteeIds = new Set(viewedMentees.map((v) => v.menteeId));

  // Count unviewed mentees with checklists
  const unviewedCount = menteesWithChecklists.filter(
    (mentee) => mentee && !viewedMenteeIds.has(mentee.id),
  ).length;

  return unviewedCount;
};
//w: (end)  ╰──────────── getUnviewedMenteesCount ────────────╯

export const MentorProgressService = {
  getMentorProgress,
  markMenteeAsViewed,
  getMenteeChecklists,
  getUnviewedMenteesCount,
};
