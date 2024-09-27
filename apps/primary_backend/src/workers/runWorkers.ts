import { Worker, Job } from "bullmq";
import fs from "fs";

import { generateFile } from "../lib/generateFile";
import { executeCpp } from "../lib/executeCpp";
import { db } from "../db";

const worker = new Worker(
  "job-runner-queue",
  async (job: Job) => {
    try {
      const sol = await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          startedAt: new Date(Date.now()),
        },
      });
      if (!sol) return JSON.stringify({ error: "no solution found" });

      const filepath = await generateFile(sol.language, sol.filepath);
      const output = await executeCpp(filepath);

      const executedCode = await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          output: output.stdout,
          status: "SUCCESS",
          completedAt: new Date(Date.now()),
        },
      });
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      fs.unlink(output.outPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      return executedCode;
    } catch (err) {
      console.log(err);
      await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          status: "ERROR",
          completedAt: new Date(Date.now()),
        },
      });
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
    concurrency: 20,
  }
);

export { worker };
