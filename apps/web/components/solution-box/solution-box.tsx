import Monaco from "../code-editor/monaco";
import EditorHeader from "./editor-header";
import OutputBox from "./output-box";

const SolutionBox = () => {
  return (
    <div className="h-[89vh] w-[48.5vw] border-[1px] flex-none rounded-lg border-slate-400 pt-4">
      <EditorHeader />
      <Monaco />
      <div className="overflow-auto h-[40%] m-2 rounded-md bg-zinc-800">
        <OutputBox />
      </div>
    </div>
  );
};

export default SolutionBox;
