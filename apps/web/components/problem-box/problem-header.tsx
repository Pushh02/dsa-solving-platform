import { currentTab } from "@repo/store/submission";
import { FileCheck, FileQuestion, TimerReset } from "lucide-react";
import { useSetRecoilState } from "recoil";

const ProblemHeader = () => {
  const setCurrentTab = useSetRecoilState(currentTab);
  return (
    <div className="h-9 w-full border-b-[1px] border-zinc-600 flex items-center cursor-pointer">
      <div
        onClick={() => {
          setCurrentTab("problem");
        }}
        className="h-[70%] w-fit ml-2 px-2 flex items-center gap-x-[3px] text-xs bg-zinc-700/70 rounded-md"
      >
        <FileQuestion className="h-4 w-4 text-red-300" />
        Problem
      </div>
      <div
        onClick={() => {
          setCurrentTab("submission");
        }}
        className="h-[70%] w-fit ml-2 px-2 flex items-center gap-x-[3px] text-xs bg-zinc-700/70 rounded-md"
      >
        <TimerReset className="h-4 w-4 text-emerald-400" />
        Submisions
      </div>
      <div
        onClick={() => {
          setCurrentTab("solution");
        }}
        className="h-[70%] w-fit ml-2 px-2 flex items-center gap-x-[3px] text-xs bg-zinc-700/70 rounded-md"
      >
        <FileCheck className="h-4 w-4 text-yellow-600" />
        Solutions
      </div>
    </div>
  );
};

export default ProblemHeader;
