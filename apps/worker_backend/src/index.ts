import express, { Request, Response, urlencoded } from "express";
import "dotenv/config";
import runRoute from "./router/run";
import submitRoute from "./router/submit";
import { SQS } from "@aws-sdk/client-sqs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/run", runRoute);
app.use("/submit", submitRoute);

setInterval(async () => {
  try {
    const sqs = new SQS({
      region: process.env.REGION,
    });

    const msg = await sqs.receiveMessage({
      QueueUrl: process.env.QUEUE_URL,
      AttributeNames: ["All"], // Request all message attributes
      MessageAttributeNames: ["All"],
    });
    if (
      msg.Messages &&
      msg.Messages[0].Attributes?.MessageGroupId === "submition"
    ) {
      await fetch(`${process.env.SELF_URL}/submit`, {
        method: "POST",
        body: JSON.stringify({ msg }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else if (
      msg.Messages &&
      msg.Messages[0].Attributes?.MessageGroupId === "run"
    ) {
      await fetch(`${process.env.SELF_URL}/run`, {
        method: "POST",
        body: JSON.stringify({ msg }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      console.log("no message available");
    }
  } catch (err) {
    console.log(err);
  }
}, 5000);

app.listen(process.env.PORT, () => {
  console.log("started on port", process.env.PORT);
});
