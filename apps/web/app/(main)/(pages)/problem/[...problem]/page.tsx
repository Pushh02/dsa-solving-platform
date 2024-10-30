"use client";

import React, { useEffect } from "react";
import Header from "@/components/header";
import ProblemBox from "@/components/problem-box/problem-box";
import SolutionBox from "@/components/solution-box/solution-box";
import SubmissionBox from "@/components/submission-tab/submission-box";
import { useRecoilValue } from "recoil";
import { submitOutput } from "@repo/store/submission";
import { cn } from "@/lib/utils";

export default function Home() {
  const submissionOutput = useRecoilValue(submitOutput);
  useEffect(() => {
    console.log(submissionOutput);
  }, [submissionOutput]);
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <div
        className={cn(
          "mt-2 flex items-center justify-around gap-x-4 mx-2 transition-all duration-300",
          submissionOutput && "transform -translate-x-2/4"
        )}
      >
        <ProblemBox />
        <SolutionBox />
        {submissionOutput ? <SubmissionBox /> : null}
      </div>
    </div>
  );
}
