import { JsonValue } from "@prisma/client/runtime/library";

export interface TestCase {
  testCase: {
    inputs: string[];
    output: string;
  };
}

export interface DryRunTestCase {
  expectedOutput: TestCase[];
  output: string[];
  status: "SUCCESS" | "ERROR" | "WRONG";
}

export type ProblemSchema = {
  id: string;
  title: string;
  description: string;
  examples: JsonValue[];
  constraints: string[];
  followUpQuestion: string | null;
  mainFunction: string;
  dryRunTestCases: TestCase[];
};
