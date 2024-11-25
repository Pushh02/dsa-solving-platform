import { Request, Response, Router } from "express";
import { SQS } from "@aws-sdk/client-sqs";

import { db } from "../db";
import axios from "axios";
import { getProblem } from "../lib/problem";
import { Status } from "@prisma/client";
import { submissionSchema } from "@repo/db/src/types";
import { base64ToString } from "../lib/base64ToString";

const router = Router();

router.post("/run", async (req: Request, res: Response) => {
  const { lang, code, problemId, profileId, problemTitle } = req.body;
  const JUDGE0_URI = process.env.JUDGE0_URI;

  if (code === undefined || lang === undefined)
    return res
      .status(400)
      .json({ success: false, error: "lang or code not provided" });

  try {
    const problem = await getProblem(problemTitle);
    if (!problem)
      return res.status(500).json({ message: "Internal server error" });
      
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
    console.log(tokens)

    const submitSol = await db.runSubmission.create({
      data: {
        problemId,
        language: lang,
        filepath: code,
        startedAt: new Date(),
        output: [],
        profileId,
      },
    });

    let tokensForUrl = tokens.map((token: any) => token.token).join(",");
    console.log(tokensForUrl)

    let outputArray: string[] = [];
    let timeArray: number[] = [];  // Initialize arrays
    let memoryArray: number[] = [];
    let allResolved = true;
    let count = 0, isSuccessfull = true;

    const interval = setInterval(async()=>{
      try{
        const submissionsResponse = await axios.get(
          `${JUDGE0_URI}/submissions/batch?tokens=${tokensForUrl}&base64_encoded=true`
        );
        const submissionsOutput = submissionsResponse.data.submissions as submissionSchema[];
        console.log(submissionsOutput)
        for(let i = 0; i < submissionsOutput.length; i++){
          if(submissionsOutput[i].status.id === 1 || submissionsOutput[i].status.id === 2){
            break;
          }
          else if(submissionsOutput[i].status.id === 3 || submissionsOutput[i].status.id === 4){
            const decodedOp = base64ToString(submissionsOutput[i].stdout);
            console.log(decodedOp)
            outputArray.push(decodedOp);
            isSuccessfull = submissionsOutput[i].status.id === 4 ? false : true;

            if(i === submissionsOutput.length-1){
              await db.runSubmission.update({
                where: { id: submitSol.id },
                data: {
                  status: isSuccessfull ? Status.Success : Status.Failed,
                  output: outputArray,
                  completedAt: new Date()
                }
              });
              clearInterval(interval);
              break;
            }
          }
          else if(submissionsOutput[i].status.id === 5){
            await db.runSubmission.update({
              where: { id: submitSol.id },
              data: {
                status: Status.Error,
                output: [base64ToString(submissionsOutput[i].status.description)],
                completedAt: new Date()
              }
            });
            clearInterval(interval);
            break;
          }
          else if(submissionsOutput[i].status.id > 5){
            await db.runSubmission.update({
              where: { id: submitSol.id },
              data: {
                status: Status.Error,
                output: [base64ToString(submissionsOutput[i].compile_output)],
                completedAt: new Date()
              }
            })
            clearInterval(interval);
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }, 1000)

    return res.send(submitSol.id);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/submit", async (req: Request, res: Response) => {
  const { lang, code, problemId, profileId } = req.body;

  if (code === undefined || lang === undefined)
    return res
      .status(400)
      .json({ success: false, error: "lang or code not provided" });

  try {
    const sqs = new SQS({
      region: process.env.REGION,
    });

    const submitSol = await db.submitSolution.create({
      data: {
        problemId,
        language: lang,
        code,
        output: {},
        profileId,
      },
    });
    await sqs.sendMessage({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: submitSol.id,
      MessageGroupId: "submition",
      MessageDeduplicationId: submitSol.id,
    });

    return res.send(submitSol.id);
  } catch (err) {
    res.json(err);
  }
});

router.post("/check", async (req: Request, res: Response) => {
  try {
    const solutionId = req.body.solutionId;

    const solution = await db.runSubmission.findFirst({
      where: {
        id: solutionId,
      },
      include: {
        problem: true,
      },
    });
    res.json(solution);
  } catch (err) {
    res.json(err);
  }
});

router.post("/checksubmission", async (req: Request, res: Response) => {
  try {
    const solutionId = req.body.solutionId;

    const solution = await db.submitSolution.findFirst({
      where: {
        id: solutionId,
      },
      include: {
        problem: true,
      },
    });
    res.json(solution);
  } catch (err) {
    res.json(err);
  }
});

export default router;
