import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentProblem, output } from "@repo/store/submission";
import TestCaseBoxDetails from "./testcase-box-details";
import { Status } from "@prisma/client";

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
    if (outputVal === Status.Pending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [outputVal]);

  useEffect(() => {
    if (
      problem &&
      problem.dryRunTestCases &&
      problem.dryRunTestCases.length > 0
    ) {
      const firstTestCase = problem.dryRunTestCases[0];
      if (firstTestCase) {
        let outputForTestCase: string | undefined;

        if (typeof outputVal === "object" && "output" in outputVal) {
          outputForTestCase = outputVal.output[0];
          if (outputVal.output[0] === "") {
            outputForTestCase = ("null");
          }
        } else if (typeof outputVal === "string") {
          outputForTestCase = outputVal;
        } else if (typeof outputVal === "object") {
          outputForTestCase = outputVal[0];
        }

        setSelectedTestCase({
          inputs: firstTestCase.testCase.inputs,
          expectedOutput: firstTestCase.testCase.output,
          output: outputForTestCase,
        });
      }
    }
  }, [problem, outputVal]);
  const showInputsAndOutput = (
    inputs: string[],
    expectedOutput: string,
    index: number
  ) => {
    let output: string | undefined;

    if (typeof outputVal === "object" && "output" in outputVal) {
      output = outputVal.output[index];
      if (outputVal.output[index] === "") {
        output = ("null");
      }
    } else if (typeof outputVal === "string") {
      output = index === 0 ? outputVal : undefined;
    } else if (typeof outputVal === "object") {
      output = outputVal[0];
    }

    setSelectedTestCase({ inputs, expectedOutput, output });
  };
  return (
    <>
      <h2 className="text-xl font-semibold m-2">Output:</h2>
      <p
        className={cn(
          "text-md ml-2 mb-2 font-semibold",
          typeof outputVal === "object" && outputVal.status === Status.Success
            ? "text-emerald-400"
            : "text-rose-400"
        )}
      >
        {typeof outputVal === "object" && outputVal.status}
      </p>
      <div className="flex ml-2 gap-x-2 mb-2">
        {problem &&
        problem.dryRunTestCases &&
        problem.dryRunTestCases.length > 0 ? (
          problem.dryRunTestCases.map((testCase, index) => (
            <div
              key={index}
              onClick={() =>
                showInputsAndOutput(
                  testCase.testCase.inputs,
                  testCase.testCase.output,
                  index
                )
              }
              className="h-7 w-20 rounded-lg bg-zinc-600 cursor-pointer"
            >
              <p className="flex items-center cursor-default justify-center h-full text-sm">
                Case {index + 1}
              </p>
            </div>
          ))
        ) : (
          <p className="m-2 text-sm">No test cases available</p>
        )}
      </div>
      {!isLoading ? (
        selectedTestCase && (
          <TestCaseBoxDetails
            inputs={selectedTestCase.inputs}
            expectedOutput={selectedTestCase.expectedOutput}
            output={selectedTestCase.output}
          />
        )
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
