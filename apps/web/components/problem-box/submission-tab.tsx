import { useUser } from "@clerk/nextjs";
import { currentProblem, submitCode } from "@repo/store/submission";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import SubmissionDetails from "./submission-details";
import { SubmitSolution } from "@prisma/client";
import ProblemLoading from "../problem-page/problem-loading";

const SubmissionTab = () => {
  const { isSignedIn, user } = useUser();
  const curProblem = useRecoilValue(currentProblem);
  const [submissions, setSubmissions] = useState<SubmitSolution[]>();
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
  }, []);
  return (
    <div className="p-4">
      {submissions ? (
        submissions.map((submission, index) => {
          return <SubmissionDetails submission={submission} key={index} />;
        })
      ) : (
        <ProblemLoading />
      )}
    </div>
  );
};

export default SubmissionTab;
