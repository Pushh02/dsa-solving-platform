"use client";

import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { ProblemSchema } from "@repo/db/types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProblemList = () => {
  const [problems, setProblems] = useState<ProblemSchema[]>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/problem`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setProblems(data);
      });
  }, []);
  
  return (
    <div>
      {problems.length > 0 &&
        problems.map((problem) => {
          return (
            <Link
              href={{pathname: `/problem/${problem.title}`}}
              className="w-full h-14 flex items-center px-6 cursor-pointer rounded-md mb-4 bg-zinc-700/40 hover:bg-zinc-700/60"
            >
              <p className="text-lg truncate w-[22%]">{problem.title}</p>
              <div className="text-xs w-[59%] h-8 overflow-hidden">
                <p className="">{problem.description}...</p>
              </div>
              <div className="w-[10%]">
                <p className="text-xs text-center">Array</p>
              </div>
              <span
                className={cn(
                  "ml-2",
                  (problem?.difficulty === Difficulty.Easy &&
                    "text-emerald-400") ||
                    (problem?.difficulty === Difficulty.Medium &&
                      "text-yellow-500") ||
                    (problem?.difficulty === Difficulty.Hard && "text-rose-500")
                )}
              >
                {problem.difficulty}
              </span>
            </Link>
          );
        })}
    </div>
  );
};

export default ProblemList;
