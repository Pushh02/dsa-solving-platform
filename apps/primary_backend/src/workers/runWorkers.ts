import { Worker, Job } from 'bullmq';

const worker = new Worker(
  "job-runner-queue",
  async (job: Job) => {
    console.log("hello world");
  },
  {
    connection: {
        host: "127.0.0.1",
        port: 6379
    },
    concurrency: 20,
  },
);

export {worker};