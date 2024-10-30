import { Difficulty } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export interface TestCase {
  testCase: {
    inputs: string[];
    output: string;
  };
}

export interface DryRunTestCase {
  expectedOutput: TestCase[];
  output: string;
  status: "SUCCESS" | "ERROR" | "WRONG";
}

export type submitionOutput = {
  inputs: string[],
  expectedOutput: string,
  output: string,
  status: "Success" | "Error" | "Failed",
  code: string
}

type examples = {
  example: {
    input: string,
    output: string
  }
}

export type languageSelect = {
  cpp: string;
}

export type ProblemSchema = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topics: string[];
  examples: examples[];
  constraints: string[];
  followUpQuestion: string | null;
  mainFunction: languageSelect;
  defaultCode: languageSelect;
  codeHeaders: languageSelect;
  dryRunTestCases: TestCase[];
};