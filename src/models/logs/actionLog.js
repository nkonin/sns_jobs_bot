import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const actionLogSchema = new Schema({
    type: {
        type: String,
        enum: ['ACCEPT', 'REJECT'],
        required: true,
    },
    message: {
        type: Schema.Types.ObjectId,
        ref: 'MessageLog',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default mongoose.model('ActionLogs', actionLogSchema);
