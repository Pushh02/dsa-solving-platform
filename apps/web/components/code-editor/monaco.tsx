"use client";

import Editor from "@monaco-editor/react";
import { language, output, problemId, runCode } from "@repo/store/submission";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const Monaco = () => {
  const defaultValue = `vector<int> twoSum(vector<int>& nums, int target){
    
}`;
  const editorRef = useRef(null);

  const [run, setRun] = useRecoilState(runCode);
  const lang = useRecoilValue(language);
  const setOutput = useSetRecoilState(output);
  const probId = useRecoilValue(problemId);

  useEffect(() => {
    if (run === true) {
      const code = showValue();
      console.log(code);
      setRun(false);
      setOutput("PENDING");

      let solutionId: string;
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/run`, {
          problemId: probId,
          code,
          lang,
        })
        .then(function (response) {
          solutionId = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      let interval = setInterval(async () => {
        const solutionStatus = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/check`,
          {
            solutionId,
          }
        );
        if (solutionStatus.data.status === "SUCCESS") {
          setOutput(solutionStatus.data.output);
          clearInterval(interval);
        }
        if (solutionStatus.data.status === "ERROR") {
          setOutput(solutionStatus.data.output);
          console.log(solutionStatus.data.output);
          clearInterval(interval);
        }
      }, 700);
    }
  }, [run]);

  //@ts-ignore
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    //@ts-ignore
    return editorRef.current?.getValue();
  }

  return (
    <div className="h-1/2 w-full">
      <Editor
        defaultLanguage={lang}
        height={"100%"}
        width={"100%"}
        theme="vs-dark"
        defaultValue={defaultValue}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default Monaco;
