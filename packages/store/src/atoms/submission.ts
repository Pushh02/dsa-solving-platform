import { ProblemSchema } from "@repo/db/types";
import { atom } from "recoil";

interface OutputInterface {
  output: string[];
  status: "SUCCESS" | "ERROR" | "WRONG";
}

export const runCode = atom({
  key: "runCode",
  default: false,
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
