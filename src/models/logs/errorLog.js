import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const errorLogSchema = new Schema({
    error: Schema.Types.Mixed,
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default mongoose.model('ErrorLogs', errorLogSchema);
