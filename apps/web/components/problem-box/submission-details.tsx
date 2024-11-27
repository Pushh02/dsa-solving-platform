import { cn } from "@/lib/utils";
import { Status, SubmitSolution } from "@prisma/client";
import { submissionOutput } from "@repo/db/types";
import { submitOutput } from "@repo/store/submission";
import { useSetRecoilState } from "recoil";

interface SubmissionDetailsProps {
  submission: SubmitSolution;
}

const SubmissionDetails = ({ submission }: SubmissionDetailsProps) => {
  const setSubmissionValue = useSetRecoilState(submitOutput);
  const output = submission.output as submissionOutput;
  const parsedOutput: submissionOutput = (() => {
    if (typeof output === "string") {
      try {
        if (output === Status.Pending) return null;
        return JSON.parse(output);
      } catch {
        return null;
      }
    }
    return output;
  })();
  return (
    <div
      onClick={() =>
        setSubmissionValue({
          ...output,
          status: submission.status,
          executionTime: submission.time || 0,
          memory: submission.memory || 0,
          code: submission.code
        })
      }
      className="w-[95%] h-16 grid grid-cols-3 bg-zinc-800 hover:bg-zinc-700/70 transition-all rounded-md cursor-default mx-auto mb-2 p-2"
    >
      <div>
        <h3
          className={cn(
            "text-xl",
            submission.status === Status.Success
              ? "text-emerald-500"
              : "text-rose-500"
          )}
        >
          {submission.status}
        </h3>
        <p className="text-xs ml-[1px]">
          {submission.startedAt
            ? `${new Date(submission.startedAt).getFullYear()} / ${new Date(submission.startedAt).getMonth() + 1} / ${new Date(submission.startedAt).getDate()}`
            : "null"}
        </p>
      </div>
      <div>
        <p>language</p>
        <p className="text-sm mt-1">{submission.language}</p>
      </div>
      <div>
        <p className="">Execution time</p>
        <p className="text-xs mt-1">
          {submission.time}ms
        </p>
      </div>
    </div>
  );
};

export default SubmissionDetails;
