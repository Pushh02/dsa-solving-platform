"use client";

import { useUser } from "@clerk/nextjs";
import Editor from "@monaco-editor/react";
import { Status } from "@prisma/client";
import {
  language,
  output,
  currentProblem,
  runCode,
  submitCode,
  submitOutput,
} from "@repo/store/submission";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const Monaco = () => {
  const editorRef = useRef(null);

  const [run, setRun] = useRecoilState(runCode);
  const [isSubmit, setIsSubmit] = useRecoilState(submitCode);
  const lang = useRecoilValue(language);
  const setOutput = useSetRecoilState(output);
  const setSubmissionOutput = useSetRecoilState(submitOutput);
  const prob = useRecoilValue(currentProblem);

  const { isSignedIn, user } = useUser();

  let defaultValue;
  if (prob.defaultCode !== undefined && "cpp" in prob.defaultCode) {
    defaultValue = prob.defaultCode.cpp;
  }

  useEffect(() => {
    if (isSignedIn) {
      if (run === true) {
        if (user === null) return;

        const code = showValue();
        setOutput(Status.Pending);

        let solutionId: string;
        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/run`, {
            problemId: prob.id,
            problemTitle: prob.title,
            code,
            lang,
            profileId: user.id,
          })
          .then(function (response) {
            solutionId = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        let count = 0;
        let interval = setInterval(async () => {
          const solutionStatus = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/check`,
            {
              solutionId,
            }
          );
          if (solutionStatus.data.status === Status.Success) {
            setOutput({
              output: solutionStatus.data.output,
              status: Status.Success,
            });
            setTimeout(() => setRun(false), 2000);
            clearInterval(interval);
          } else if (solutionStatus.data.status === Status.Error) {
            setOutput({
              output: solutionStatus.data.output,
              status: Status.Error,
            });
            setTimeout(() => setRun(false), 2000);
            clearInterval(interval);
          } else if (solutionStatus.data.status === Status.Failed) {
            setOutput({
              output: solutionStatus.data.output,
              status: Status.Failed,
            });
            setTimeout(() => setRun(false), 2000);
            clearInterval(interval);
          }

          if (count >= 9) {
            setOutput({
              output: ["Time Limit Exceeded - Too slow lil bro"],
              status: Status.Error,
            });
            setTimeout(() => setRun(false), 2000);
            clearInterval(interval);
          }
          count += 1;
        }, 1000);
      }
      if (isSubmit === true) {
        if (user === null) return;

        const code = showValue();
        setSubmissionOutput(Status.Pending);

        let solutionId: string;
        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/submit`, {
            problemId: prob.id,
            problemTitle: prob.title,
            code,
            lang,
            profileId: user.id,
          })
          .then(function (response) {
            solutionId = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        let count = 0;
        let interval = setInterval(async () => {
          const solutionStatus = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/checksubmission`,
            {
              solutionId,
            }
          );
          if (solutionStatus.data.status === Status.Success) {
            setSubmissionOutput({
              ...solutionStatus.data.output,
              status: solutionStatus.data.status,
              code: solutionStatus.data.code,
              executionTime: solutionStatus.data.time,
            });
            setTimeout(() => setIsSubmit(false), 2000);
            clearInterval(interval);
          } else if (solutionStatus.data.status === Status.Error) {
            setSubmissionOutput({
              ...solutionStatus.data.output,
              status: solutionStatus.data.status,
              code: solutionStatus.data.code,
              executionTime: solutionStatus.data.time,
            });
            setTimeout(() => setIsSubmit(false), 2000);
            clearInterval(interval);
          } else if (solutionStatus.data.status === Status.Failed) {
            setSubmissionOutput({
              ...solutionStatus.data.output,
              status: solutionStatus.data.status,
              code: solutionStatus.data.code,
              executionTime: solutionStatus.data.time,
            });
            setTimeout(() => setIsSubmit(false), 2000);
            clearInterval(interval);
          }

          if (count >= 9) {
            setSubmissionOutput({
              output: "Time Limit Exceeded - Too slow lil bro",
              status: Status.Error,
              executionTime: 0,
              inputs: "",
              expectedOutput: "",
              code: code
            });
            setTimeout(() => setIsSubmit(false), 2000);
            clearInterval(interval);
          }
          count += 1;
        }, 1000);
      }
    }
  }, [run, isSubmit]);

  //@ts-ignore
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function showValue() {
    //@ts-ignore
    return editorRef.current?.getValue();
  }

  return (
    <div className="h-1/2 w-full">
      {prob.defaultCode !== undefined && (
        <Editor
          defaultLanguage={lang}
          height={"100%"}
          width={"100%"}
          theme="vs-dark"
          defaultValue={defaultValue}
          onMount={handleEditorDidMount}
        />
      )}
    </div>
  );
};

export default Monaco;
