import { exec } from "child_process";

const executeCommand = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ message: error.message, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};

export default executeCommand;