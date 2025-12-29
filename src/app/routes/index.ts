//
import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.route";
import { NetworkRoutes } from "../modules/network/network.routes";
import { ChecklistEndGoalsRoutes } from "../modules/ChecklistEndGoal/checklistEndGoal.routes";
import { MentorProgressRoutes } from "../modules/mentorProgress/mentorProgress.routes";

type TAllRoutes = {
  path: string;
  route: Router;
};

//w: (start)╭──────────── allRoutes ────────────╮
const allRoutes: TAllRoutes[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/network",
    route: NetworkRoutes,
  },
  {
    path: "/checklist-end-goals",
    route: ChecklistEndGoalsRoutes,
  },
  {
    path: "/mentor-progress",
    route: MentorProgressRoutes,
  },
];
//w: (end)  ╰──────────── allRoutes ────────────╯

export const router = Router();
allRoutes.forEach((r) => router.use(r.path, r.route));
