import { Request, Response, Router } from "express";
import { SQS } from "@aws-sdk/client-sqs";

import { db } from "../db";
import axios from "axios";
import { getProblem } from "../lib/problem";
import { Status } from "@prisma/client";

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
    console.log(response.data);
    const tokens: JSON[] = response.data;

    const submitSol = await db.runSubmission.create({
      data: {
        problemId,
        language: lang,
        filepath: code,
        output: [],
        profileId,
      },
    });

    let tokensForUrl = "";
    for (let i = 0; i < tokens.length; i++) {
      tokensForUrl += tokens[i] + ",";
      if (i === tokens.length - 1) tokensForUrl += tokens[i];
    }

    //resolving the tokens

    let outputArray: string[] = [];
    const interval = setInterval(async () => {
      try {
        const submissionsResponse = await axios.get(
          `http://${JUDGE0_URI}/submissions/batch?tokens=${tokensForUrl}&base64_encoded=true`
        );
        const submissionsOutput = submissionsResponse.data;

        // Filter and decode results
        let allResolved = true;
        let count = 0, isSuccessfull = true;

        //@ts-ignore
        submissionsOutput.submissions.forEach((submission: any, index) => {
          if (outputArray.length <= index) {
            if (submission.status.description !== "Processing") {
              let bufferObj = Buffer.from(submission.stdout || "", "base64");
              let decodedOutput = bufferObj.toString("utf8");
              outputArray[index] = decodedOutput; // Save to the correct index

              if(submission.status.description !== "Accepted"){
                isSuccessfull = false
              }
            } else {
              allResolved = false; // If any submission is still processing
              count++
            }
          }
        });

        if(count >= 6){
          clearInterval(interval)
          outputArray.push("unexpected error occured")
        }

        // If all submissions are resolved, clear the interval
        if (allResolved) {
          clearInterval(interval);
          const updateOutput = await db.runSubmission.update({
            where:{
              id: submitSol.id
            },
            data: {
              status: isSuccessfull ? Status.Success : Status.Failed,
              output: outputArray,
              completedAt: new Date()
            }
          })
          console.log("All outputs resolved:", outputArray);
        }
      } catch (error) {
        console.error("Error resolving tokens:", error);
        clearInterval(interval); // Stop polling in case of error
      }
    }, 1000);

    return res.send(submitSol.id);
  } catch (err) {
    res.json(err);
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
