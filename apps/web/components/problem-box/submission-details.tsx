import { cn } from "@/lib/utils";
import { submissionOutput } from "@repo/db/types";

interface SubmissionDetailsProps {
    submission: submissionOutput;
  }

const SubmissionDetails = ({ submission }: SubmissionDetailsProps) => {
  return (
    <div className="w-[95%] h-16 bg-zinc-800 hover:bg-zinc-700/70 transition-all rounded-md mx-auto mb-2 p-2">
      <h3
        className={cn(
          "text-xl",
          submission.status === "SUCCESS"
            ? "text-emerald-500"
            : "text-rose-500"
        )}
      >
        {submission.status}
      </h3>
    </div>
  );
};

export default SubmissionDetails;
