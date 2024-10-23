"use client";

import React from "react";
import { RecoilRoot } from "recoil";
import Header from "@/components/header";
import ProblemBox from "@/components/problem-box/problem-box";
import SolutionBox from "@/components/solution-box/solution-box";

export default function Home() {
  return (
    <RecoilRoot>
      <div className="h-screen w-screen overflow-hidden">
        <Header />
        <div className="mt-2 flex items-center justify-center gap-x-2">
          <ProblemBox />
          <SolutionBox />
        </div>
      </div>
    </RecoilRoot>
  );
}
