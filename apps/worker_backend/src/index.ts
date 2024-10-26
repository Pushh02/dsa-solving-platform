import express, { Request, Response } from "express";
import "dotenv/config";
import { SQS } from "@aws-sdk/client-sqs";

import fs from "fs";
import { db } from "./db";
import { generateFile } from "./lib/generateFile";
import { languageSelect } from "@repo/db/src/types";
import { executeCpp } from "./lib/executeCpp";

const app = express();

app.post("/run", async (req: Request, res: Response) => {
  try {
    const sqs = new SQS({
      region: process.env.REGION,
    });

    const msg = await sqs.receiveMessage({
      QueueUrl: process.env.QUEUE_URL,
    });
    if (msg.Messages) {
      const solutionId = msg.Messages[0].Body;
      console.log(solutionId);

      try {
        //starting the execution.
        //Updating the startedAt field to track the time of execution
        const sol = await db.runSubmission.update({
          where: {
            id: solutionId,
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
        if (!sol || !problemDetails) {
          sqs.deleteMessage({
            QueueUrl: process.env.QUEUE_URL,
            ReceiptHandle: msg.Messages[0].ReceiptHandle,
          });
          return JSON.stringify({ error: "no solution found" });
        }

        //mapping the testcases object to run all the testcases on the code
        const testCases = problemDetails.dryRunTestCases as any;
        let outputArray: any[] = [];
        let outputStatus = true;

        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Execution timeout - exceeded 4 seconds'));
            }, 4000);
          });

          const executionPromise = async () => {
            for (const testCase of testCases) {
              const filepath = await generateFile(
                sol.language,
                sol.filepath,
                problemDetails.mainFunction as languageSelect,
                problemDetails.codeHeaders as languageSelect,
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

            return { outputStatus, outputArray };
          };

          const result = await Promise.race([executionPromise(), timeoutPromise]);
          
          // Type assertion to access the result properties
          const { outputStatus: finalStatus, outputArray: finalOutput } = result as { outputStatus: boolean, outputArray: any[] };

          //Updating the output the completedAt field to track the time took for execution
          if (finalStatus) {
            const executedCode = await db.runSubmission.update({
              where: {
                id: solutionId,
              },
              data: {
                output: finalOutput,
                status: "SUCCESS",
                completedAt: new Date(Date.now()),
              },
            });

            sqs.deleteMessage({
              QueueUrl: process.env.QUEUE_URL,
              ReceiptHandle: msg.Messages[0].ReceiptHandle,
            });

            return executedCode;
          } else {
            const executedCode = await db.runSubmission.update({
              where: {
                id: solutionId,
              },
              data: {
                output: finalOutput,
                status: "WRONG",
                completedAt: new Date(Date.now()),
              },
            });

            sqs.deleteMessage({
              QueueUrl: process.env.QUEUE_URL,
              ReceiptHandle: msg.Messages[0].ReceiptHandle,
            });

            return executedCode;
          }
        } catch (err: any) {
          const errorMessage = err.message === 'Time Limit Exceeded - Too slow lil bro'
            ? 'Code execution timed out (4 seconds limit exceeded)'
            : JSON.stringify(err);

          const erroredCode = await db.runSubmission.update({
            where: {
              id: solutionId,
            },
            data: {
              status: "ERROR",
              output: [errorMessage],
              completedAt: new Date(Date.now()),
            },
          });


          sqs.deleteMessage({
            QueueUrl: process.env.QUEUE_URL,
            ReceiptHandle: msg.Messages[0].ReceiptHandle,
          });

          console.error("Error in test case processing:", err);
          return erroredCode;
        }
      } catch (err) {
        const erroredCode = await db.runSubmission.update({
          where: {
            id: solutionId,
          },
          data: {
            status: "ERROR",
            output: ["internal error"],
            completedAt: new Date(Date.now()),
          },
        });

        sqs.deleteMessage({
          QueueUrl: process.env.QUEUE_URL,
          ReceiptHandle: msg.Messages[0].ReceiptHandle,
        });

        console.log(err);
        return erroredCode;
      }
    } else {
      res.send("no data in queue");
      console.log("no data");
    }
  } catch (err) {
    console.log(err);
  }
});

setInterval(async () => {
  try {
    await fetch(`${process.env.SELF_URL}/run`, { method: "POST" });
  } catch (err) {
    console.log(err);
  }
}, 10000);

app.listen(process.env.PORT, () => {
  console.log("started on port", process.env.PORT);
});
