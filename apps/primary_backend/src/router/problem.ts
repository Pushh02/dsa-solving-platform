import { Request, Response, Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", async(req: Request, res: Response) =>{
    try{
        const title = req.query.title;
        const problem = await db.problem.findFirst({
            where: {
                title: title as string,
            }
        });
        res.send(problem);
    } catch (err){
        res.send(err);
    }
})

router.post("/post", async (req: Request, res: Response) => {
  try {
    const problem = await db.problem.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        difficulty: req.body.difficulty,
        examples: req.body.examples,
        constraints: req.body.constraints,
        followUpQuestion: req.body.followUpQuestion,
        mainFunction: req.body.mainFunction,
        codeHeaders: req.body.codeHeaders,
        defaultCode: req.body.defaultCode,
        dryRunTestCases: req.body.dryRunTestCases,
        // submitTestCases: req.body.submitTestCases,
      },
    });
    res.send(problem);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});


export default router;
