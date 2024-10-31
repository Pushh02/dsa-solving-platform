"use client";

import { ProblemSchema } from "@repo/db/types";
import { currentProblem, currentTab } from "@repo/store/submission";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ProblemHeader from "./problem-header";
import ProblemTab from "./problem-tab";
import SubmissionTab from "./submission-tab";

const ProblemBox = () => {
  const [problemData, setproblemData] = useState<ProblemSchema>();
  const setProblem = useSetRecoilState(currentProblem);
  const crntTab = useRecoilValue(currentTab);
  const router = useRouter();
  const url = usePathname();
  const split = url.split("/");
  //@ts-ignore
  const title = decodeURIComponent(split[split.length - 1]);

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
    <div className="h-[89vh] w-[48.5vw] border-[1px] flex-none rounded-lg border-slate-400 overflow-auto">
      <ProblemHeader />
      {crntTab === "problem" ? (
        <ProblemTab problemData={problemData} />
      ) : crntTab === "submission" ? (
        <SubmissionTab />
      ) : null}
    </div>
  );
};

export default ProblemBox;
