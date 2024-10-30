"use client";

import { useUser } from "@clerk/nextjs";
import Editor from "@monaco-editor/react";
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
  const setSubmitionOutput = useSetRecoilState(submitOutput);
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
        setRun(false);
        setOutput("PENDING");

        let solutionId: string;
        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/run`, {
            problemId: prob.id,
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
          if (solutionStatus.data.status === "SUCCESS") {
            setOutput({
              output: solutionStatus.data.output,
              status: "SUCCESS",
            });
            clearInterval(interval);
          } else if (solutionStatus.data.status === "ERROR") {
            setOutput({ output: solutionStatus.data.output, status: "ERROR" });
            clearInterval(interval);
          } else if (solutionStatus.data.status === "WRONG") {
            setOutput({ output: solutionStatus.data.output, status: "WRONG" });
            clearInterval(interval);
          }

          if (count >= 9) {
            setOutput({
              output: ["Time Limit Exceeded - Too slow lil bro"],
              status: "ERROR",
            });
            clearInterval(interval);
          }
          count += 1;
        }, 700);
      }
      if (isSubmit === true) {
        if (user === null) return;

        const code = showValue();
        setIsSubmit(false);
        setSubmitionOutput("PENDING");

        let solutionId: string;
        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/submit`, {
            problemId: prob.id,
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
          if (solutionStatus.data.status === "SUCCESS") {
            setSubmitionOutput(solutionStatus.data.output)
            clearInterval(interval);
          } else if (solutionStatus.data.status === "ERROR") {
            setSubmitionOutput(solutionStatus.data.output)
            clearInterval(interval);
          } else if (solutionStatus.data.status === "WRONG") {
            setSubmitionOutput(solutionStatus.data.output)
            clearInterval(interval);
          }

          if (count >= 9) {
            setOutput({
              output: ["Time Limit Exceeded - Too slow lil bro"],
              status: "ERROR",
            });
            clearInterval(interval);
          }
          count += 1;
        }, 700);
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
