import prisma from "../../../shared/prisma";
import { TCreateGroupSchema } from "./group.validation";

//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: TCreateGroupSchema) => {
  console.log("working", {
    userId,
    payload,
  });

await prisma.

};
//w: (end)  ╰──────────── createGroup ────────────╯

export const GroupService = {
  createGroup,
};
