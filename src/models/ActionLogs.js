import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ActionLogsSchema = new Schema({
  type: {
    type: String,
    enum: ["ACCEPT", "REJECT"],
    required: true
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: "MessageLogs",
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const ActionLogs = mongoose.model("ActionLogs", ActionLogsSchema);

export default ActionLogs;
