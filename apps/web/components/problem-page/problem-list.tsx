import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { ProblemSchema } from "@repo/db/types";
import Link from "next/link";
import { use } from "react";

async function getProblems(): Promise<ProblemSchema[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/problem`, {
    cache: 'force-cache',
    // cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch problems');
  }
  
  return res.json();
}
const ProblemList = () => {
  const problems = use(getProblems());
  return (
    <div>
      {problems.length > 0 &&
        problems.map((problem) => {
          return (
            <Link
              href={{pathname: `/problem/${problem.title}`}}
              className="w-full h-14 flex items-center px-6 cursor-pointer rounded-md mb-4 bg-zinc-700/40 hover:bg-zinc-700/60"
            >
              <p className="text-lg truncate w-[23%] -ml-1">{problem.title}</p>
              <div className="text-xs w-[59%] h-8 overflow-hidden">
                <p className="">{problem.description}...</p>
              </div>
              <div className="w-[10%]">
                <p className="text-[0.6rem] text-center">{problem.topics[0]}</p>
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
