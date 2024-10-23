"use client";

import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { ProblemSchema } from "@repo/db/types";
import { currentProblem } from "@repo/store/submission";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

const ProblemBox = () => {
  const [problemData, setproblemData] = useState<ProblemSchema>();
  const setProblem = useSetRecoilState(currentProblem);
  const router = useRouter();
  const url = usePathname();
  const split = url.split("/")
  //@ts-ignore
  const title = (decodeURIComponent(split[split.length-1]))

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/problem/get`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: { title: title },
      })
      .then((problem) => {
        return problem.data;
      })
      .then((data) => {
        setProblem(data);
        setproblemData(data);
      })
      .catch((err) => {
        router.replace("/");
        console.log(err);
      });
  }, []);

  // if(!problem)
  //   router.replace("/");

  return (
    <div className="h-[89vh] w-[47vw] border-[1px] rounded-lg border-slate-400 p-4 overflow-auto">
      <h1 className="text-2xl font-semibold">{problemData?.title}</h1>
      <p className="text-xs mt-2">
      difficulty: 
      <span
        className={cn(
          "ml-2",
          (problemData?.difficulty === Difficulty.Easy && "text-emerald-400") ||
          (problemData?.difficulty === Difficulty.Medium &&"text-yellow-500") ||
          (problemData?.difficulty === Difficulty.Hard && "text-rose-500")
        )}
      >
        {problemData?.difficulty}
      </span>
      </p>
      <div className="text-[#d1d1d1] text-sm mt-2">
        <p className="leading-9">{problemData?.description}</p>
        <div>
          <p className="text-lg mb-2 font-medium text-white">inputs</p>
          {problemData?.examples.map((example) => {
            return (
              <div className="leading-7 mb-2">
                <p>{example.example.input}</p>
                <p>{example.example.output}</p>
              </div>
            );
          })}
        </div>
        <div>
          <p className="text-lg my-2 font-medium text-white"> Constraints: </p>
          {problemData?.constraints.map((constraints) => {
            return <p className="leading-7">{constraints}</p>;
          })}
          <br />
        </div>
        <p>{problemData?.followUpQuestion}</p>
      </div>
    </div>
  );
};

export default ProblemBox;
