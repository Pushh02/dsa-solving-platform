"use client";

import { ProblemSchema } from "@repo/db/types";
import { currentProblem } from "@repo/store/submission";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

const ProblemBox = () => {
  const [problemData, setproblemData] = useState<ProblemSchema>();
  const setProblem = useSetRecoilState(currentProblem);
  const router = useRouter();
  
  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/problem`, {
      headers: {
        "Content-Type": "application/json"
      },
      params: { title: "1. 2Sum" }
    }).then((problem)=>{
      return problem.data;
    }).then((data)=>{
      setProblem(data)
      setproblemData(data)
    }).catch((err)=>{
      router.replace("/");
      console.log(err)
    })
  }, [])

  // if(!problem)
  //   router.replace("/");
      
  return (
    <div className="h-[89vh] w-[47vw] border-[1px] rounded-lg border-slate-400 p-4 overflow-auto">
      <h1 className="text-3xl font-semibold">{problemData?.title}</h1>
      <div className="text-[#d1d1d1] text-md mt-2">
        <p className="leading-9">
          {problemData?.description}
        </p>
        <div>
          <p className="text-lg mb-2 font-medium">inputs</p>
          {problemData?.examples.map((example) => {
            return(
              <div className="leading-7">
                <p>{example.example.input}</p>
                <p>{example.example.output}</p>
              </div>
            )
          })}
        </div>
        <div>
          <p className="text-lg my-2 font-medium"> Constraints: </p>
          {problemData?.constraints.map((constraints)=>{
            return(
              <p className="leading-7">{constraints}</p>
            )
          })}
          <br />
        </div>
        <p>{problemData?.followUpQuestion}</p>
      </div>
    </div>
  );
};

export default ProblemBox;
