import { Queue } from "bullmq";
import redis from "./redis";

export const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  },
});
