import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const errorLogSchema = new Schema({
    type: String,
    error: Schema.Types.Mixed,
    extra: Schema.Types.Mixed,
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default mongoose.model('ErrorLogs', errorLogSchema);
