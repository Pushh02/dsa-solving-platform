import { useState } from "react";
import TestCaseBoxDetails from "./testcase-box-details";

interface TestCaseBoxProps {
  expectedOutput: string;
  output: string;
  index: number;
}

const TestCaseBox = ({ expectedOutput, output, index }: TestCaseBoxProps) => {
  const [show, setShow] = useState(false);
  const showDetails = () => {
    return (
        <TestCaseBoxDetails
        expectedOutput = {expectedOutput}
        output = {output}
        />
    );
  };
  return (
    <div>
      <div
        onClick={() => setShow(true)}
        className="h-9 w-20 rounded-lg bg-gray-400 cursor-pointer"
      >
        <p className="flex items-center justify-center h-full text-black">
          Case{index + 1}
        </p>
      </div>
      {show ? showDetails() : null}
    </div>
  );
};

export default TestCaseBox;
