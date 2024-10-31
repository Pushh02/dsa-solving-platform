import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { ProblemSchema } from "@repo/db/types";

interface ProblemTabProps {
    problemData: ProblemSchema | undefined;
}

const ProblemTab = ({problemData}: ProblemTabProps) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">{problemData?.title}</h1>
      <p className="text-xs mt-2">
        difficulty:
        <span
          className={cn(
            "ml-2",
            (problemData?.difficulty === Difficulty.Easy &&
              "text-emerald-400") ||
              (problemData?.difficulty === Difficulty.Medium &&
                "text-yellow-500") ||
              (problemData?.difficulty === Difficulty.Hard && "text-rose-400")
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

export default ProblemTab;
