import { Request, Response, Router } from "express";

import { db } from "../db";
import { generateFile } from "../lib/generateFile";
import { executeCpp } from "../lib/executeCpp";
import { addJobToQueue } from "../queues/runQueue";

const router = Router();

router.post("/run", async (req: Request, res: Response) => {
  const { lang, code } = req.body;

  if (code === undefined || lang === undefined)
    return res
      .status(400)
      .json({ success: false, error: "lang or code not provided" });


  try{
    // const filepath = await generateFile(lang, code);
    const submitSol = await db.runSubmission.create({
      data: {
        language: lang,
        filepath: code,
        output: "",
      }
    })
    addJobToQueue(submitSol.id);

    return res.send(submitSol.id);
  } catch(err) {
    res.json(err);
  }
});

router.post("/submit", (req: Request, res: Response) => {});

router.post("/check", async(req: Request, res: Response) =>{
  const solutionId = req.body.solutionId;

  const solution = await db.runSubmission.findFirst({
    where: {
      id: solutionId,
    }
  })
  res.json(solution);
})

export default router;
