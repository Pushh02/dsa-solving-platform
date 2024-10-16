import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentProblem, output } from "@repo/store/submission";
import TestCaseBoxDetails from "./testcase-box-details";

const OutputBox = () => {
  const outputVal = useRecoilValue(output);
  const [isLoading, setIsLoading] = useState(false);
  const problem = useRecoilValue(currentProblem);
  const [selectedTestCase, setSelectedTestCase] = useState<{
    inputs: string[];
    expectedOutput: string;
    output: string | undefined;
  } | null>(null);

  useEffect(() => {
    if (outputVal === "PENDING") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [outputVal]);

  useEffect(() => {
    // Set the first test case as selected when the problem loads or changes
    if (
      problem &&
      problem.dryRunTestCases &&
      problem.dryRunTestCases.length > 0
    ) {
      const firstTestCase = problem.dryRunTestCases[0];
      if (firstTestCase) {
        if (outputVal) {
          setSelectedTestCase({
            inputs: firstTestCase.testCase.inputs,
            expectedOutput: firstTestCase.testCase.output,
            output: outputVal[0],
          });
        } else {
          setSelectedTestCase({
            inputs: firstTestCase.testCase.inputs,
            expectedOutput: firstTestCase.testCase.output,
            output: undefined,
          });
        }
      }
    }
  }, [problem, outputVal]);

  const showInputsAndOutput = (
    inputs: string[],
    expectedOutput: string,
    output: string | undefined
  ) => {
    setSelectedTestCase({ inputs, expectedOutput, output });
  };
  return (
    <>
      <h2 className="text-xl font-semibold m-2">Output:</h2>
      <div className="flex ml-2 gap-x-2 mb-2">
        {problem &&
        problem.dryRunTestCases &&
        problem.dryRunTestCases.length > 0 ? (
          problem.dryRunTestCases.map((testCase, index) => {
            return (
              <div
                key={index}
                onClick={() =>
                  showInputsAndOutput(
                    testCase.testCase.inputs,
                    testCase.testCase.output,
                    outputVal[index]
                  )
                }
                className="h-7 w-20 rounded-lg bg-zinc-600 cursor-pointer"
              >
                <p className="flex items-center justify-center h-full">
                  Case {index + 1}
                </p>
              </div>
            );
          })
        ) : (
          <p className="m-2 text-sm">No test cases available</p>
        )}
      </div>
      {!isLoading ? (
        selectedTestCase &&
        (outputVal === "" ? (
          <TestCaseBoxDetails
            inputs={selectedTestCase.inputs}
            expectedOutput={selectedTestCase.expectedOutput}
            output={undefined}
          />
        ) : (
          <TestCaseBoxDetails
            inputs={selectedTestCase.inputs}
            expectedOutput={selectedTestCase.expectedOutput}
            output={selectedTestCase.output}
          />
        ))
      ) : (
        <div className="flex h-24 items-center justify-center ml-2 gap-x-2">
          <Loader2 className="animate-spin h-6" />
          <h2 className="text-xl flex items-center">Loading...</h2>
        </div>
      )}
    </>
  );
};

export default OutputBox;