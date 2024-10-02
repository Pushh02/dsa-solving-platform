import { atom } from "recoil";

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
  default: "",
});

export const problemId = atom({
  key: "problemId",
  default: "",
});
