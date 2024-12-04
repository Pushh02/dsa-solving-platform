import { Status } from "@prisma/client";
import { CurrentTab, ProblemSchema, submissionOutput } from "@repo/db/types";
import { atom } from "recoil";

interface OutputInterface {
  output: string[];
  status: Status;
  time: number;
  memory: number;
}

export const runCode = atom({
  key: "runCode",
  default: false,
});

export const submitCode = atom({
  key: "submitCode",
  default: false,
});

export const submitOutput = atom({
  key: "submitOutput",
  default: "" as string | submissionOutput,
});

export const language = atom({
  key: "language",
  default: "cpp",
});

export const output = atom({
  key: "output",
  default: "" as string | OutputInterface,
});

export const currentProblem = atom({
  key: "currentProblem",
  default: {} as ProblemSchema,
});

export const currentTab = atom({
  key: "currentTab",
  default: "problem" as CurrentTab
})
