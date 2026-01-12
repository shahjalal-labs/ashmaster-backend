//w: (start)╭──────────── createGroup ────────────╮
const createGroup = async (userId: string, payload: any) => {
  console.log("working", {
    userId,
    payload,
  });
};
//w: (end)  ╰──────────── createGroup ────────────╯

export const GroupService = {
  createGroup,
};
