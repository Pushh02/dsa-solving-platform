"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import ProblemBox from "@/components/problem-box/problem-box";
import SolutionBox from "@/components/solution-box/solution-box";
import SubmissionBox from "@/components/submission-tab/submission-box";
import { useRecoilValue } from "recoil";
import { submitOutput } from "@repo/store/submission";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Home() {
  const submissionOutput = useRecoilValue(submitOutput);
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    console.log(submissionOutput);
  }, [submissionOutput]);
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <div
        className={cn(
          "mt-2 flex items-center justify-around gap-x-4 mx-2 transition-all duration-300",
          isOpen && submissionOutput
            ? "transform -translate-x-2/4"
            : "transform translate-x-0"
        )}
      >
        <ProblemBox />
        <SolutionBox />
        {isOpen && submissionOutput ? (
          <div className="relative">
            <SubmissionBox />
            <Plus onClick={()=>{setIsOpen(false)}} className="h-8 w-8 absolute top-6 right-12 rotate-45" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
