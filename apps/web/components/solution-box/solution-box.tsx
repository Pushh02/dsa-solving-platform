import { useRecoilValue } from "recoil";
import Monaco from "../code-editor/monaco";
import EditorHeader from "./editor-header";
import { output } from "@repo/store/submission";


const SolutionBox = () => {
  const outputVal = useRecoilValue(output);
  return (
    <div className="h-[89vh] w-[47vw] border-[1px] rounded-lg border-slate-400 pt-4">
      <EditorHeader />
      <Monaco />
      <div className="overflow-auto h-[40%] m-2 rounded-md bg-zinc-800">
        <h2 className="text-xl font-semibold m-2">Output:</h2>
      <p className="m-2 text-sm">{outputVal}</p>
      </div>
      
    </div>
  );
};

export default SolutionBox;