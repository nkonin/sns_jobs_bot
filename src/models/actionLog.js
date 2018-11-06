import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const actionLogSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
        },
        extra: Schema.Types.Mixed,
        created_at: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    { versionKey: false },
);

export default mongoose.model('ActionLogs', actionLogSchema);
