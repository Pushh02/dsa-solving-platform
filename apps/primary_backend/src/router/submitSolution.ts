import { Request, Response, Router } from "express";
import { SQS } from "@aws-sdk/client-sqs";

import { db } from "../db";
import axios from "axios";
import { getProblem } from "../lib/problem";
import { Status } from "@prisma/client";
import { submissionSchema } from "@repo/db/src/types";
import { base64ToString } from "../lib/base64ToString";
import { runCode } from "../lib/runCode";
import { submitCode } from "../lib/submitCode";

const router = Router();

router.post("/run", async (req: Request, res: Response) => {
  const { lang, code, problemId, profileId, problemTitle } = req.body;
  
  
  if (code === undefined || lang === undefined)
    return res
  .status(400)
  .json({ success: false, error: "lang or code not provided" });
  
  try {
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
    const problem = await getProblem(problemTitle);
    if (!problem)
      return res.status(500).json({ message: "Internal server error" });
    
    runCode(problem, code, submitSol.id)
      .then(() => { 
        console.log(`Code execution completed for submission ID: ${submitSol.id}`);
      })
      .catch((error) => {
          console.error(`Error executing code for submission ID: ${submitSol.id}`, error);
        });

      return res.send(submitSol.id);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  router.post("/submit", async (req: Request, res: Response) => {
    const { lang, code, problemId, profileId, problemTitle } = req.body;
    
    const submitSol = await db.submitSolution.create({
      data: {
        problemId,
        language: lang,
        code,
        startedAt: new Date(),
        output: {},
        profileId,
      },
    });
  if (code === undefined || lang === undefined)
    return res
      .status(400)
      .json({ success: false, error: "lang or code not provided" });

  try {
    const problem = await getProblem(problemTitle);
    if (!problem)
      return res.status(500).json({ message: "Internal server error" });

    submitCode(problem, code, submitSol.id)
      .then(() => { 
        console.log(`Code execution completed for submission ID: ${submitSol.id}`);
      })
      .catch((error) => {
          console.error(`Error executing code for submission ID: ${submitSol.id}`, error);
        });

    return res.send(submitSol.id);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
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
