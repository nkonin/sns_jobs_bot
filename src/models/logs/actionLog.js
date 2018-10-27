import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const actionLogSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    extra: {
        type: Schema.Types.Mixed,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default mongoose.model('ActionLogs', actionLogSchema);
