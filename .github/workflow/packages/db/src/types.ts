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
input: string,
  expectedOutput: string,
  output: string,
  status: Status,
  code: string,
  executionTime: number,
  memory: number
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
  solution: solutionSchema;
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

export type solutionSchema = {
  explaination: string,
  code: string
  videoLink: string,
}