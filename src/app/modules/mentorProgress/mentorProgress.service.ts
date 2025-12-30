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
          checklistEndGoal: true,
        },
      },
      receiver: {
        select: {
          id: true,
          checklistEndGoal: true,
        },
      },
    },
  });

  const mentees = connections
    .flatMap((c) => [c.sender, c.receiver])
    .filter((senderReceiver) => senderReceiver.id !== userId);
  console.log(mentees, "mentorProgress.service.ts", 47);
  return mentees;
};
//w: (end)  ╰──────────── mentorChecklistView ────────────╯

export const MentorProgressService = {
  mentorChecklistView,
};
