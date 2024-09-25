"use client";

import Editor from "@monaco-editor/react";
import { language, output, runCode } from "@repo/store/submission";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const Monaco = ({ problemId }: { problemId: string }) => {
  const defaultValue = `int twoSum(vector<int>& nums, int target){
    
}`;
  const editorRef = useRef(null);

  const [run, setRun] = useRecoilState(runCode);
  const lang = useRecoilValue(language);
  const setOutput = useSetRecoilState(output)

  useEffect(() => {
    if (run === true) {
      const code = showValue();
      console.log(code);
      setRun(false);

      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compile/run`, {
          problemId,
          code,
          lang,
        })
        .then(function (response) {
          setOutput(response.data);
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
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
