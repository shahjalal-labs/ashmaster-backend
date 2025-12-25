//w: (start)╭──────────── createChecklistEndGoals ────────────╮
const createChecklistEndGoals = async (userId: string, payload: any) => {
  console.log({
    userId,
    payload,
  });
};
//w: (end)  ╰──────────── createChecklistEndGoals ────────────╯

export const ChecklistEndGoalsService = {
  createChecklistEndGoals,
};
