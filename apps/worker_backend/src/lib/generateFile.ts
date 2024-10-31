import { languageSelect } from "@repo/db/src/types";
import * as fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (
  language: string,
  content: string,
  mainFunction: languageSelect,
  codeHeaders: languageSelect,
  inputs: any[]
) => {
  const jobId = uuid();
  const filename = `${jobId}.${language}`;
  const filepath = path.join(dirCodes, filename);


  if(language === "cpp"){
    let modifiedMainFunction = mainFunction.cpp;
    inputs.map((input: string) => {
      modifiedMainFunction = modifiedMainFunction.replace("<<input>>", input);
    });
  
    fs.appendFileSync(filepath, codeHeaders.cpp);
    fs.appendFileSync(filepath, content);
    fs.appendFileSync(filepath, modifiedMainFunction);
  
    return filepath;
  } else {
    throw new Error("invalid language");
  }
};

export { generateFile };
