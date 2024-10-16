"use client";

import { currentProblem } from "@repo/store/submission";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

type problem = {
  id: String,
  title: String,
  description: String,
  example: JSON,
  constraints: String[],
  followUpQuestion?: String,
  dryRunTestCases: JSON
}

const ProblemBox = () => {
  const [problemData, setproblemData] = useState<problem>();
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
        <p>
          Example 1: <br /> <br />
          Input: nums = [2,7,11,15], target = 9 Output: [0,1] Explanation:
          Because nums[0] + nums[1] == 9, we return [0, 1]. <br />
          Example 2:
          <br />
          <br />
          Input: nums = [3,2,4], target = 6<br />
          Output: [1,2]
          <br />
          Example 3:
          <br />
          <br />
          Input: nums = [3,3], target = 6 Output: [0,1]
        </p>
        Constraints: <br />
        {"2 <= nums.length <= 104"}
        <br />
        {"-109 <= nums[i] <= 109"}
        <br />
        {"-109 <= target <= 109"}
        <br />
        Only one valid answer exists. Follow-up: Can you come up with an
        algorithm that is less than O(n2) time complexity?
      </div>
    </div>
  );
};

export default ProblemBox;
