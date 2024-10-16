import { useState } from "react";
import TestCaseBoxDetails from "./testcase-box-details";

interface TestCaseBoxProps {
  expectedOutput: string[];
  output: string;
  index: number;
}

const TestCaseBox = ({ expectedOutput, output, index }: TestCaseBoxProps) => {
  const [show, setShow] = useState(false);
  // const showDetails = () => {
  //   return (
  //       <TestCaseBoxDetails
  //       expectedOutput = {expectedOutput}
  //       output = {output}
  //       />
  //   );
  // };
  return (
    <div>
      
      {/* {show ? showDetails() : null} */}
    </div>
  );
};

export default TestCaseBox;
