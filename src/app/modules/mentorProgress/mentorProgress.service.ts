import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

//w: (start)╭──────────── mentorChecklistView ────────────╮
const mentorChecklistView = async (userId: string) => {
  const mentor = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!mentor || !(mentor.role === "MENTOR")) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only mentor can view this");
  }

  const connections = await prisma.connections.findMany({
    where: {
      OR: [
        {
          receiverId: userId,
          status: "ACCEPTED",
        },
        {
          senderId: userId,
          status: "ACCEPTED",
        },
      ],
    },
    select: {
      id: true,
      sender: {
        select: {
          id: true,
        },
      },
      receiver: {
        select: {
          id: true,
        },
      },
    },
  });

  const connectedMenteeIds = [
    //w: ...new Set makes the array unique if anyway create's any duplicacy. Though no duplicacy will come still for better backend safety
    ...new Set(
      connections
        .flatMap((c) => [c.sender.id, c.receiver.id])
        .filter((id) => id !== userId),
    ),
  ];

  const menteesWithChecklist = await prisma.user.findMany({
    where: {
      id: {
        in: connectedMenteeIds,
      },
      role: "MENTEE",
      checklistEndGoal: {
        some: {
          type: "CHECKLIST",
        },
      },
    },
  });
  return menteesWithChecklist;
};

//w: (end)  ╰──────────── mentorChecklistView ────────────╯

export const MentorProgressService = {
  mentorChecklistView,
};
