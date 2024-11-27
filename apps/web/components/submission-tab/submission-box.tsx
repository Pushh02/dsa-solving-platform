"use client";

import { cn } from "@/lib/utils";
import { Status } from "@prisma/client";
import { submissionOutput } from "@repo/db/types";
import { currentProblem, submitOutput } from "@repo/store/submission";
import { Check, Copy, Loader, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";

const SubmissionBox = () => {
  const problem = useRecoilValue(currentProblem);
  const submissionOutput = useRecoilValue(submitOutput);

  const [isCopied, setIsCopied] = useState(false);

  // Check if submission is pending
  const isPending = submissionOutput === Status.Pending;

  // Parse submission output if it's a JSON string
  const parsedOutput: submissionOutput = (() => {
    if (typeof submissionOutput === "string") {
      try {
        if (submissionOutput === Status.Pending) return null;
        return JSON.parse(submissionOutput);
      } catch {
        return null;
      }
    }
    return submissionOutput;
  })();
  console.log(parsedOutput.input)

  // Determine submission status
  const isSuccess = isPending
    ? null
    : parsedOutput && parsedOutput.status === Status.Success
      ? true
      : false;

  const copyCode = () => {
    const range = document.createRange();
    //@ts-ignore
    range.selectNode(document.getElementById("code"));
    window.getSelection()?.removeAllRanges(); // clear current selection
    window.getSelection()?.addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
        {isPending ? (
          <div className="flex items-center gap-x-1">
            <Loader2 className="animate-spin text-white" /> Pending...
          </div>
        ) : isSuccess ? (
          "Successful! :D"
        ) : (
          "Failed"
        )}
        {parsedOutput && (
          <p className="text-[0.63rem] opacity-60">
            time: {parsedOutput.executionTime}ms memory: {parsedOutput.memory}kb
          </p>
        )}
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
              <div className="space-y-2 font-mono">
                <p className="text-sm text-[#d1d1d1]">
                  <span className="font-medium break-words">Input:{" "}
                  {parsedOutput.input}</span>
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
              <p className="text-sm text-[#d1d1d1]">
                All tests passed successfully!
              </p>
            </div>
          )}

          <div className="w-full p-4 border-[1px] border-zinc-500 rounded-md relative">
            <h3 className="text-lg font-medium text-[#e2e2e2] mb-2">
              Your Code
            </h3>
            <button
              onClick={copyCode}
              className="absolute right-4 top-4 p-1 border-[1px] border-zinc-600 rounded-lg"
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <pre
              id="code"
              className="text-sm text-[#d1d1d1] whitespace-pre-wrap"
            >
              {parsedOutput.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionBox;
