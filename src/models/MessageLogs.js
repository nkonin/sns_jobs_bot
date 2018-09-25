import mongoose from "mongoose";

const Schema = mongoose.Schema;
const MessageLogsSchema = new Schema({
  payload: Schema.Types.Mixed,
  user: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});

const MessageLogs = mongoose.model("MessageLogs", MessageLogsSchema);

export default MessageLogs;
