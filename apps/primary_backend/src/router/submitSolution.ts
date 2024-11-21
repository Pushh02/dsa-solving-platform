import { Request, Response, Router } from "express";
import { SQS } from "@aws-sdk/client-sqs";

import { db } from "../db";
import axios from "axios";
import { getProblem } from "../lib/problem";

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
    if(!problem)
      return res.status(500).json({message: "Internal server error"})

    problem.fullBoilerPlate = problem.fullBoilerPlate.replace("//##USERS_CODE_HERE", code);

    const response = await axios.post(`${JUDGE0_URI}/submissions/batch`, {
      submissions: problem.inputs.map((input, index) => ({
        language_id: 52, // hardcoded for c++
        source_code: problem.fullBoilerPlate
          .replace("##INPUT_FILE_INDEX##", index.toString())
          .replace("##OUTPUT_FILE_INDEX##", index.toString()),
      })),
      cpu_time_limit: 10,
    });
    console.log(response); //debugging
    const submitSol = await db.runSubmission.create({
      data: {
        problemId,
        language: lang,
        filepath: code,
        output: [],
        profileId,
      },
    });

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
