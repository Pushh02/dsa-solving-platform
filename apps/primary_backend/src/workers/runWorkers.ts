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
      if (!sol || !problemDetails) return JSON.stringify({ error: "no solution found" });

      //mapping the testcases object to run all the testcases on the code
      const testCases = problemDetails.dryRunTestCases as unknown;
      let outputArray: any[] = [];
      let outputStatus = true;

      try {
        //@ts-ignore
        for (const testCase of testCases) {
            const filepath = await generateFile(
              sol.language,
              sol.filepath,
              problemDetails.mainFunction,
              testCase.testCase.inputs
            );
        
            const output = await executeCpp(filepath);
            outputArray.push(`${output.stdout}`);
        
            if (output.stdout != testCase.testCase.output) {
              outputStatus = false;
            }
        
            await fs.promises.unlink(filepath);
            if (output.outPath) {
              await fs.promises.unlink(output.outPath);
            }
        }

        //Updating the output the completedAt field to track the time took for execution
        console.log(outputArray)
        if(outputStatus){
          const executedCode = await db.runSubmission.update({
            where: {
              id: job.data.id,
            },
            data: {
              output: outputArray,
              status: "SUCCESS",
              completedAt: new Date(Date.now()),
            },
          });

          return executedCode;
        } else {
          const executedCode = await db.runSubmission.update({
            where: {
              id: job.data.id,
            },
            data: {
              output: outputArray,
              status: "WRONG",
              completedAt: new Date(Date.now()),
            },
          });

          return executedCode;
        }

      } catch (err: any) {
        const error = JSON.stringify(err);
        await db.runSubmission.update({
          where: {
            id: job.data.id,
          },
          data: {
            status: "ERROR",
            output: [error],
            completedAt: new Date(Date.now()),
          },
        });
        console.error("Error in test case processing:", err);
      }
    } catch (err) {
      await db.runSubmission.update({
        where: {
          id: job.data.id,
        },
        data: {
          status: "ERROR",
          output: ["internal error"],
          completedAt: new Date(Date.now()),
        },
      });
      console.log(err);
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
