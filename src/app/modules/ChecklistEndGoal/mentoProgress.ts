import prisma from "../../../shared/prisma";

export const mentorChecklist = async (userId: string) => {
  const mentor = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};
