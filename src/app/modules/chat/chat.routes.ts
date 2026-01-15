import { Router } from "express";
import { ChatController } from "./chat.controller";

const router = Router();

router.get("/", ChatController.getMessages);

export const ChatRoutes = router;
