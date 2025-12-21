//
import { Queue } from "bullmq";
import redisClient from "../../shared/redis";

export const emailQueue = new Queue("emails", {
  connection: redisClient,
});

//p: Email queue for processing email jobs
//w: Email queue for processing email jobs
// t: Email queue for processing email jobs