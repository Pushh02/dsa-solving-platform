import * as fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const dirCodes = path.join(__dirname, "codes");

const headers = `#include<iostream>
#include<bits/stdc++.h>
using namespace std;
`;

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format: string, content: string, mainFunction: string, inputs:any[]) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);

  let modifiedMainFunction = mainFunction;
  inputs.map((input:string)=>{
    modifiedMainFunction = modifiedMainFunction.replace("<<input>>", input);
  });

  fs.appendFileSync(filepath, headers);
  fs.appendFileSync(filepath, content);
  fs.appendFileSync(filepath, modifiedMainFunction);

  return filepath;
};

export { generateFile };