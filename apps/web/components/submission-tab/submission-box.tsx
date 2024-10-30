import { cn } from "@/lib/utils";
import { submitionOutput } from "@repo/db/types";
import { currentProblem, submitOutput } from "@repo/store/submission";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

const SubmissionBox = () => {
  const problem = useRecoilValue(currentProblem);
  const submissionOutput = useRecoilValue(submitOutput);

  // Check if submission is pending
  const isPending = submissionOutput === "PENDING";

  // Parse submission output if it's a JSON string
  const parsedOutput: submitionOutput = (() => {
    if (typeof submissionOutput === "string") {
      try {
        if (submissionOutput === "PENDING") return null;
        return JSON.parse(submissionOutput);
      } catch {
        return null;
      }
    }
    return submissionOutput;
  })();

  // Determine submission status
  const isSuccess = isPending ? null : parsedOutput && parsedOutput.status === "Success" ? true : false;

  return (
    <div className="h-[89vh] w-[47vw] border-[1px] flex-none rounded-lg border-slate-400 p-4 overflow-auto mr-2">
      <h2
        className={cn(
          "text-2xl font-semibold mb-2",
          isPending
            ? "text-yellow-400"
            : isSuccess
              ? "text-emerald-400"
              : "text-rose-400"
        )}
      >
        {isPending ? "Pending..." : isSuccess ? "Successful! :D" : "Failed"}
      </h2>

      <h2 className="text-2xl text-[#e2e2e2]">{problem.title}</h2>
      <p className="text-[#d1d1d1] text-sm mt-2 leading-7">
        {problem.description}
      </p>

      {parsedOutput && (
        <div className="space-y-4 mt-4">
          {parsedOutput.status === "Failed" ? (
            <div className="w-full p-4 border-[1px] border-zinc-500 rounded-md">
              <h3 className="text-lg font-medium text-[#e2e2e2] mb-2">
                Test Results
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-[#d1d1d1]">
                  <span className="font-medium">Input:</span>{" "}
                  {parsedOutput.inputs.join(", ")}
                </p>
                <p className="text-sm text-[#d1d1d1]">
                  <span className="font-medium">Expected Output:</span>{" "}
                  {parsedOutput.expectedOutput}
                </p>
                <p className="text-sm text-[#d1d1d1]">
                  <span className="font-medium">Your Output:</span>{" "}
                  {parsedOutput.output}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full p-4 border-[1px] border-zinc-500 rounded-md">
              <h3 className="text-lg font-medium text-[#e2e2e2] mb-2">
                Test Results
              </h3>
              <p className="text-sm text-[#d1d1d1]">All tests passed successfully!</p>
            </div>
          )}

          <div className="w-full p-4 border-[1px] border-zinc-500 rounded-md">
            <h3 className="text-lg font-medium text-[#e2e2e2] mb-2">
              Your Code
            </h3>
            <pre className="text-sm text-[#d1d1d1] whitespace-pre-wrap">
              {parsedOutput.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionBox;
