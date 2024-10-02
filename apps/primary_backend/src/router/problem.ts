import { Request, Response, Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", async(req: Request, res: Response) =>{
    try{
        const title = req.body.title;
        const problem = await db.problem.findFirst({
            where: {
                title,
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
        examples: req.body.examples,
        constraints: req.body.constraints,
        followUpQuestion: req.body.followUpQuestion,
        mainFunction: req.body.mainFunction,
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
