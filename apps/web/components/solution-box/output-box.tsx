import { output } from "@repo/store/submission";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import TestCaseBox from "./testcase-box";
import { cn } from "@/lib/utils";

const OutputBox = () => {
  const outputVal = useRecoilValue(output);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (outputVal === "PENDING") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    console.log(outputVal);
  }, [outputVal]);

  const renderOutput = () => {
    if (typeof outputVal === "string") {
      return <p className="m-2 text-sm">{outputVal}</p>;
    } else if (Array.isArray(outputVal) && outputVal.length > 0) {
      return (
        <div>
          {outputVal.map((item, index) => (
            <div>
              <p
                className={cn(
                  "m-2 text-sm font-semibold",
                  item.status === "SUCCESS" ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {item.status}
              </p>
              <div key={index} className="flex gap-x-3 ml-2">
                {item.expectedOutput.map((testCase, i) => {
                  return (
                    <TestCaseBox
                      /*@ts-ignore*/
                      expectedOutput={testCase.testCase.output}
                      output={item.output[i] || ""}
                      index={i}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h2 className="text-xl font-semibold m-2">Output:</h2>
      {isLoading ? (
        <div className="flex items-center ml-2 gap-x-2">
          <Loader2 className="animate-spin h-6" />
          <h2 className="text-xl flex items-center">Loading...</h2>
        </div>
      ) : (
        renderOutput()
      )}
    </>
  );
};

export default OutputBox;
