interface TestCaseBoxDetailsProps {
  inputs: string[];
  expectedOutput: string;
  output: string | undefined;
}

const TestCaseBoxDetails = ({ inputs, output, expectedOutput }: TestCaseBoxDetailsProps) => {
  return (
    <div className="w-full text-sm">
      {inputs.length > 0 &&
        inputs.map((input, i) => {
          return (
            <div key={i} className="ml-2">
              <p>input: </p>
              <p className="w-11/12 h-fit my-2 px-2 py-[2px] text-sm bg-zinc-700 rounded-md">
                {input}
              </p>
            </div>
          );
        })}
        <div className="ml-2">
          <p>Expected output: </p>
          <p className="w-11/12 h-fit my-2 px-2 py-[2px] text-sm bg-zinc-700 rounded-md">
            {expectedOutput}
          </p>
        </div>
      {output && (
        <div className="ml-2">
          <p>output: </p>
          <p className="w-11/12 h-fit my-2 px-2 py-[2px] text-sm bg-zinc-700 rounded-md">
            {output}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestCaseBoxDetails;
