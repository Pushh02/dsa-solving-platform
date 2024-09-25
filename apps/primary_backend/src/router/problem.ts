import { Request, Response, Router } from "express";
import { db } from "../db";

const router = Router();

router.post("/post", async(req: Request, res: Response) =>{
    const problem = await db.problem.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            examples: req.body.examples,
            constraints: req.body.constraints,
            followUpQuestion: req.body.followUpQuestion,
            runTestCases: req.body.runTestCases,
            submitTestCases: req.body.submitTestCases,
        }
    });
    res.send(problem);
})

router.get("/", (req, res) => {
    res.send("hello");
})

export default router;