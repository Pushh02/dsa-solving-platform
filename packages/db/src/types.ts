import { Difficulty, Status } from "@prisma/client";

export interface TestCase {
  testCase: {
    inputs: string[];
    output: string;
  };
}

export interface DryRunTestCase {
  expectedOutput: TestCase[];
  output: string;
  input: string;
}

export type submissionOutput = {
inputs: string,
  expectedOutput: string,
  output: string,
  status: Status,
  code: string,
  executionTime: number | null
}

export type CurrentTab = "problem" | "solution" | "submission"

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

export type submissionSchema = {
  stdout: string,
  time: number,
  memory: number,
  stderr: string | null,
  token: string,
  compile_output: string,
  message: string,
  status: {
      id: number,
      description: string
  }
}