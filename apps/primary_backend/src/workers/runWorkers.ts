import { Worker, Job } from "bullmq";
import fs from "fs";

import { generateFile } from "../lib/generateFile";
import { executeCpp } from "../lib/executeCpp";
import { db } from "../db";

const worker = new Worker(
  "job-runner-queue",
  async (job: Job) => {
    try {
      //starting the execution.
      //Updating the startedAt field to track the time of execution
      const sol = await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          startedAt: new Date(Date.now()),
        },
      });
      const problemDetails = await db.problem.findFirst({
        where: {
          id: sol.problemId,
        },
      });
      if (!sol) return JSON.stringify({ error: "no solution found" });
      if (!problemDetails)
        return JSON.stringify({ error: "no solution found" });

      //mapping the testcases object to run all the testcases on the code
      const testCases = problemDetails.dryRunTestCases;
      let outputArray: string[] = [];

      try {
        //@ts-ignore
        await Promise.all(testCases.map(async (testCase) => {
          try {
            const filepath = await generateFile(
              sol.language,
              sol.filepath,
              problemDetails.mainFunction,
              testCase.testCase.inputs
            );
            const output = await executeCpp(filepath);
            console.log(typeof(output.stdout), " ", typeof(testCase.testCase.output));
            if (output.stdout == testCase.testCase.output) {
              outputArray.push("true");
            } else {
              outputArray.push("false");
            }
            console.log(outputArray)
      
            await Promise.all([
              fs.promises.unlink(filepath),
              fs.promises.unlink(output.outPath)
            ]);
          } catch (err) {
            console.error('Error processing test case:', err);
            outputArray.push("false");
          }
        }));
      } catch (err) {
        console.error('Error in test case processing:', err);
      }

      //Updating the completedAt field to track the time of execution
      const executedCode = await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          output: outputArray[0],
          status: "SUCCESS",
          completedAt: new Date(Date.now()),
        },
      });

      return executedCode;
    } catch (err) {
      const error = JSON.stringify(err);
      await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          status: "ERROR",
          output: error,
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
