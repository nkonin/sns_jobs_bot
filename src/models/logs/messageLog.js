import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const messageLogSchema = new Schema({
    payload: Schema.Types.Mixed,
    user: String,
    created_at: { type: Date, default: Date.now },
});

export default mongoose.model('MessageLog', messageLogSchema);
