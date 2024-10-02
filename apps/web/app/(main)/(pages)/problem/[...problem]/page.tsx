"use client";

import React from "react";
import { RecoilRoot } from "recoil";
import Navbar from "@/components/navbar";
import ProblemBox from "@/components/problem-box/problem-box";
import SolutionBox from "@/components/solution-box/solution-box";
import { currentProfile } from "@/lib/current-profile";

export default async function Home() {

  return (
    <RecoilRoot>
      <div className="h-screen w-screen overflow-hidden">
        <Navbar />
        <div className="mt-2 flex items-center justify-center gap-x-2">
          <ProblemBox />
          <SolutionBox />
        </div>
      </div>
    </RecoilRoot>
  );
}
