import { Router } from "express";
import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/messages/:id", auth(), ChatController.getMessages);

export const ChatRoutes = router;
