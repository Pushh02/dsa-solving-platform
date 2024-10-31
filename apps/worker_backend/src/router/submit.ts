import { Request, Response, Router } from "express";
import { SQS } from "@aws-sdk/client-sqs";

import fs from "fs";
import { db } from "../db";
import { generateFile } from "../lib/generateFile";
import { languageSelect, submissionOutput } from "@repo/db/src/types";
import { executeCpp } from "../lib/executeCpp";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const sqs = new SQS({
      region: process.env.REGION,
    });

    const { msg } = req.body;

    if (msg.Messages) {
      const solutionId = msg.Messages[0].Body;
      console.log(solutionId);

      try {
        //starting the execution.
        //Updating the startedAt field to track the time of execution
        const sol = await db.submitSolution.update({
          where: {
            id: solutionId,
          },
          data: {
            startedAt: new Date(Date.now()),
          },
          include: {
            problem: true,
          },
        });
        if (!sol) {
          sqs.deleteMessage({
            QueueUrl: process.env.QUEUE_URL,
            ReceiptHandle: msg.Messages[0].ReceiptHandle,
          });
          return JSON.stringify({ error: "no solution found" });
        }

        //mapping the testcases object to run all the testcases on the code
        const testCases = sol.problem.submitTestCases as any;
        let outputJson: submissionOutput = {
          inputs: [""],
          expectedOutput: "",
          output: "",
          status: "SUCCESS",
          code: sol.code
        };
        let outputStatus = true;

        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("Execution timeout - exceeded 4 seconds"));
            }, 8000);
          });

          const executionPromise = async () => {
            await Promise.all(
              //@ts-ignore
              testCases.map(async (testCase) => {
                const filepath = await generateFile(
                  sol.language,
                  sol.code,
                  sol.problem.mainFunction as languageSelect,
                  sol.problem.codeHeaders as languageSelect,
                  testCase.testCase.inputs
                );
                const output = await executeCpp(filepath);

                // Check if output matches expected output
                if (output.stdout !== testCase.testCase.output) {
                  outputJson = {
                    inputs: testCase.testCase.inputs,
                    expectedOutput: testCase.testCase.output,
                    output: output.stdout,
                    status: "FAILED",
                    code: sol.code
                  };
                  outputStatus = false;
                  throw { outputStatus, outputJson }; // Early exit on failure
                }

                // Cleanup files
                await fs.promises.unlink(filepath);
                if (output.outPath) {
                  await fs.promises.unlink(output.outPath);
                }
              })
            ).catch((err) => {
              outputStatus = err.outputStatus;
              outputJson = err.outputJson;
            })

            return { outputStatus, outputJson };
          };

          const result = await Promise.race([
            executionPromise(),
            timeoutPromise,
          ]);

          // Type assertion to access the result properties
          const { outputStatus: finalStatus, outputJson: finalOutput } =
            result as { outputStatus: boolean; outputJson: JSON };

          //Updating the output the completedAt field to track the time took for execution
          if (finalStatus) {
            const executedCode = await db.submitSolution.update({
              where: {
                id: solutionId,
              },
              data: {
                output: JSON.stringify(finalOutput),
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
            const executedCode = await db.submitSolution.update({
              where: {
                id: solutionId,
              },
              data: {
                output: JSON.stringify(finalOutput),
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
          const errorMessage =
            err.message === "Time Limit Exceeded - Too slow lil bro"
              ? "Code execution timed out (4 seconds limit exceeded)"
              : JSON.stringify(err);

          const erroredCode = await db.submitSolution.update({
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
        const erroredCode = await db.submitSolution.update({
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

export default router;
