import express, { Application } from "express";
import cors from "cors";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";
import { router } from "./app/routes";
import { bullBoardRouter } from "./jobs/bullBoard";
import basicAuth from "express-basic-auth";
import { entryMessage } from "./app/middlewares/entry";
import { notFound } from "./app/middlewares/notFound";
import helmet from "helmet";
import config, { ENV } from "./config";

const app: Application = express();

if (config.env === ENV.PRODUCTION) {
  app.use(helmet());
}

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

// not found handler
app.use(notFound);

export default app;
