import express from "express";
import "dotenv/config";
import cors from "cors";

import problemRoute from "./router/problem";
import solution from "./router/submitSolution";

const app = express();
const port = process.env.PORT;

var corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

app.use("/problem", problemRoute);
app.use("/compile", solution);

app.listen(port, () => {
  console.log(`started on port ${port}`);
});
