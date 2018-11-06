import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const messageLogSchema = new Schema(
    {
        data: Schema.Types.Mixed,
        created_at: { type: Date, default: Date.now },
    },
    { versionKey: false },
);

export default mongoose.model('MessageLog', messageLogSchema);
