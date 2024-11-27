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

export const runCode = async (
  problem: Problem,
  code: string,
  submissionId: string
) => {
  try {
    const JUDGE0_URI = process.env.JUDGE0_URI;

    problem.fullBoilerPlate = problem.fullBoilerPlate.replace(
      "//##USERS_CODE_HERE",
      code
    );

    let submissions: any[] = [];
    for (let i = 0; i < 3; i++) {
      submissions.push({
        language_id: 52, // hardcoded for c++
        source_code: btoa(
          problem.fullBoilerPlate
            .replace("##INPUT_FILE_INDEX##", i.toString())
            .replace("##OUTPUT_FILE_INDEX##", i.toString())
        ),
      });
    }

    const response = await axios.post(
      `${JUDGE0_URI}/submissions/batch?base64_encoded=true`,
      {
        submissions,
      }
    );

    const tokens: any[] = response.data;
    console.log(tokens);

    let tokensForUrl = tokens.map((token: any) => token.token).join(",");
    console.log(tokensForUrl);

    let outputArray: string[] = [];
    let timeArray: number[] = []; // Initialize arrays
    let memoryArray: number[] = [];
    let isAllResolved = false;
    let executionStatus: Status = Status.Pending;

    const interval = setInterval(async () => {
      try {
        const submissionsResponse = await axios.get(
          `${JUDGE0_URI}/submissions/batch?tokens=${tokensForUrl}&base64_encoded=true`
        );
        const submissionsOutput = submissionsResponse.data
          .submissions as submissionSchema[];
        console.log(submissionsOutput);
        for (let i = 0; i < submissionsOutput.length; i++) {
          if (
            submissionsOutput[i].status.id === 1 ||
            submissionsOutput[i].status.id === 2
          ) {
            break;
          } else if (
            submissionsOutput[i].status.id === 3 ||
            submissionsOutput[i].status.id === 4
          ) {
            const decodedOp = base64ToString(submissionsOutput[i].stdout);
            outputArray.push(decodedOp);
            executionStatus =
              executionStatus === Status.Failed
                ? Status.Failed
                : submissionsOutput[i].status.id === 4
                  ? Status.Failed
                  : Status.Success;

            timeArray.push(submissionsOutput[i].time);
            memoryArray.push(submissionsOutput[i].memory);

            if (i === submissionsOutput.length - 1) {
              isAllResolved = true
              clearInterval(interval);
              break;
            }
          } else if (submissionsOutput[i].status.id === 5) {
            isAllResolved = true;
            clearInterval(interval);
            break;
          } else if (submissionsOutput[i].status.id > 5) {
            outputArray.push(base64ToString(submissionsOutput[i].stdout));
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
        if(isAllResolved){
          let avgTime = calculateAvgTime(timeArray);
          console.log(avgTime)

          let avgMemory = calculateAvgMemory(memoryArray);
          console.log(avgMemory)

          await db.runSubmission.update({
            where: { id: submissionId },
            data: {
              time: avgTime,
              memory: avgMemory,
              status: executionStatus,
              output: outputArray,
              completedAt: new Date(),
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};
