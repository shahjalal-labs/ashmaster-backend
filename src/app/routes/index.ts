//
import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.route";

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
];
//w: (end)  ╰──────────── allRoutes ────────────╯

export const router = Router();
allRoutes.forEach((r) => router.use(r.path, r.route));
