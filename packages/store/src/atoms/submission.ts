import { atom } from "recoil";

interface outputInterface {
  expectedOutput: JSON[],
  output: string,
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
  default: "" as string | outputInterface[],
});

export const problemId = atom({
  key: "problemId",
  default: "",
});
