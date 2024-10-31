import { useUser } from "@clerk/nextjs";
import { submissionOutput } from "@repo/db/types";
import { currentProblem, submitCode } from "@repo/store/submission";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import SubmissionDetails from "./submission-details";

const SubmissionTab = () => {
  const { isSignedIn, user } = useUser();
  const curProblem = useRecoilValue(currentProblem);
  const [submissions, setSubmissions] = useState<submissionOutput[]>([]);
  useEffect(() => {
    if (isSignedIn) {
      if (user === null) return;

      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/problem/getsubmission`, {
          profileId: user.id,
          problemId: curProblem.id,
        })
        .then((response) => {
          setSubmissions(response.data.submitSolution);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log(submissions);
  }, []);
  return (
    <div className="p-4">
      {submissions.map((submission, index) => {
        return <SubmissionDetails submission={submission} key={index} />;
      })}
    </div>
  );
};

// export default dynamic(() => Promise.resolve(SubmissionTab));
export default SubmissionTab;
