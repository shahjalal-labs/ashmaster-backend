import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

//w: (start)╭──────────── mentorChecklist ────────────╮
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
      sender: true,
      receiver: true,
    },
  });
  console.log(connections, "mentorProgress.service.ts", 18);
};

//w: (end)  ╰──────────── mentorChecklist ────────────╯

export const MentorProgressService = {
  mentorChecklistView,
};
