import fs from "fs";

const MOUNT_PATH = process.env.MOUNT_PATH;

interface Problem {
    fullBoilerPlate: string,
    inputs: string[],
    outputs: string[],
}

export const getProblem = async (problemTitle: string): Promise<Problem> => {
  const fullBoilerPlate = await getProblemsFullBoilerPlate(problemTitle);

  const inputs = await getProblemsInputs(problemTitle)
  const outputs = await getProblemsOutputs(problemTitle)

  return {
    fullBoilerPlate,
    inputs,
    outputs
  }
};

const getProblemsFullBoilerPlate = (problemTitle: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${MOUNT_PATH}/${problemTitle}/boilerplate/main.cpp`,
      { encoding: "utf-8" },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

const getProblemsInputs = (problemTitle: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(
      `${MOUNT_PATH}/${problemTitle}/tests/inputs`,
      async (err, files) => {
        if (err) {
          console.log(err);
        } else {
          await Promise.all(
            files.map((file) => {
              return new Promise<string>((resolve, reject) => {
                fs.readFile(
                  `${MOUNT_PATH}/${problemTitle}/tests/inputs/${file}`,
                  { encoding: "utf-8" },
                  (err, data) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(data);
                  }
                );
              });
            })
          )
            .then((data) => {
              resolve(data);
            })
            .catch((e) => reject(e));
        }
      }
    );
  });
};

const getProblemsOutputs = (problemTitle: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      fs.readdir(
        `${MOUNT_PATH}/${problemTitle}/tests/inputs`,
        async (err, files) => {
          if (err) {
            console.log(err);
          } else {
            await Promise.all(
              files.map((file) => {
                return new Promise<string>((resolve, reject) => {
                  fs.readFile(
                    `${MOUNT_PATH}/${problemTitle}/tests/outputs/${file}`,
                    { encoding: "utf-8" },
                    (err, data) => {
                      if (err) {
                        reject(err);
                      }
                      resolve(data);
                    }
                  );
                });
              })
            )
              .then((data) => {
                resolve(data);
              })
              .catch((e) => reject(e));
          }
        }
      );
    });
  };
