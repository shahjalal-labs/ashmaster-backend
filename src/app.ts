import express, { Application, NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import cors from "cors";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";
import { router } from "./app/routes";
import { bullBoardRouter } from "./jobs/bullBoard";
import basicAuth from "express-basic-auth";
import { notFount } from "./app/middlewares/notFound";
import { entryMessage } from "./app/middlewares/entry";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Route handler for root endpoint
app.get("/", entryMessage);

// Router setup
app.use("/api/v1", router);

app.use(
  "/admin/queues",
  basicAuth({
    users: { admin: process.env.BULLBOARD_PASSWORD || "supersecret" },
    challenge: true,
  }),
  bullBoardRouter,
);

// Global Error Handler
app.use(GlobalErrorHandler);

app.use(notFount);

export default app;
