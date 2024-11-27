import { submissionSchema } from "@repo/db/src/types";
import axios from "axios";
import { base64ToString } from "./base64ToString";
import { db } from "../db";
import { Status } from "@prisma/client";
import { calculateAvgMemory, calculateAvgTime } from "./calculateAvg";

interface Problem {
  fullBoilerPlate: string;
  inputs: string[];
  outputs: string[];
}

export const submitCode = async (
  problem: Problem,
  code: string,
  submissionId: string
) => {
  const JUDGE0_URI = process.env.JUDGE0_URI;

  problem.fullBoilerPlate = problem.fullBoilerPlate.replace(
    "//##USERS_CODE_HERE",
    code
  );

  const submissions = problem.inputs.map((input, index) => ({
    language_id: 52, // hardcoded for c++
    source_code: btoa(
      problem.fullBoilerPlate
        .replace("##INPUT_FILE_INDEX##", index.toString())
        .replace("##OUTPUT_FILE_INDEX##", index.toString())
    ),
  }));

  const response = await axios.post(
    `${JUDGE0_URI}/submissions/batch?base64_encoded=true`,
    {
      submissions,
    }
  );

  const tokens: any[] = response.data;
  console.log(tokens);

  let tokensForUrl = tokens.map((token: any) => token.token).join(",");

  let outputJson = {
    input: "",
    expectedOutput: "",
    output: "" as string | null,
  };
  let timeArray: number[] = []; // Initialize arrays
  let memoryArray: number[] = [];
  let isAllResolved = false;
  let executionStatus: Status = Status.Success;

  const interval = setInterval(async () => {
    try {
      const submissionsResponse = await axios.get(
        `${JUDGE0_URI}/submissions/batch?tokens=${tokensForUrl}&base64_encoded=true`
      );
      const submissionsOutput = submissionsResponse.data
        .submissions as submissionSchema[];
      console.log(submissionsOutput);

      let index = 0;
      for (let i = index; i < submissionsOutput.length; i++) {
        if (
          submissionsOutput[i].status.id === 1 ||
          submissionsOutput[i].status.id === 2
        ) {
          break;
        }
        index++; //remember the index if any submission is still processing
        if (
          submissionsOutput[i].status.id === 3 ||
          submissionsOutput[i].status.id === 4
        ) {
          executionStatus =
            executionStatus === Status.Failed
              ? Status.Failed
              : submissionsOutput[i].status.id === 4
                ? Status.Failed
                : Status.Success;

          timeArray.push(submissionsOutput[i].time);
          memoryArray.push(submissionsOutput[i].memory);

          if (i === submissionsOutput.length - 1) {
            isAllResolved = true;
            clearInterval(interval);
            break;
          }
        } else if (submissionsOutput[i].status.id === 5) {
          outputJson = {
            input: problem.inputs[i],
            expectedOutput: problem.outputs[i],
            output: base64ToString(submissionsOutput[i].status.description),
          };
          isAllResolved = true;
          executionStatus = Status.Failed;
          clearInterval(interval);
          break;
        } else if (submissionsOutput[i].status.id > 5) {
          outputJson = {
            input: problem.inputs[i],
            expectedOutput: problem.outputs[i],
            output: submissionsOutput[i].stdout
              ? base64ToString(submissionsOutput[i].stdout)
              : null,
          };
          executionStatus = Status.Failed;
          timeArray.push(submissionsOutput[i].time);
          memoryArray.push(submissionsOutput[i].memory);

          if (i === submissionsOutput.length - 1) {
            isAllResolved = true;
            clearInterval(interval);
            break;
          }
        }
      }
      if (isAllResolved) {
        console.log(executionStatus);
        const avgTime = calculateAvgTime(timeArray)
        const avgMemory = calculateAvgMemory(memoryArray)
        await db.submitSolution.update({
          where: { id: submissionId },
          data: {
            time: avgTime,
            memory: avgMemory,
            status: executionStatus,
            output: outputJson,
            completedAt: new Date(),
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, 1000);
};
