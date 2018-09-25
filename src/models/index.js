import ActionLogs from "./ActionLogs";
import MessageLogs from "./MessageLogs";
import mongoose from "mongoose";

const url = process.env.MONGO_URL || "mongodb://localhost:27017/sns_jobs_bot";

mongoose.connect(url, { useNewUrlParser: true })
  .then(() => console.log("CONNECTED TO DB"))
  .catch(err => console.error(err));

export { ActionLogs, MessageLogs };
