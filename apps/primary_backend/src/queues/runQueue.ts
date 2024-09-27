import { Queue } from "bullmq";
import { worker } from "../workers/runWorkers";

const jobQueue = new Queue("job-runner-queue");

const addJobToQueue = async (jobId: string) => {
  jobQueue.add("job-runner-queue", {
    id: jobId,
  });
};

worker.on("completed", (job) =>{
  console.log(job.data, "added");
});

export { addJobToQueue };
