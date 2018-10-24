import mongoose from 'mongoose';
import ActionLog from './logs/actionLog';
import MessageLog from './logs/messageLog';
import Vote from './vote'
import Message from './message'

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/sns_jobs_bot';

mongoose
    .connect(
        url,
        { useNewUrlParser: true },
    )
    .then(() => console.log('CONNECTED TO DB'))
    .catch(err => console.error(err));

export { ActionLog, MessageLog, Vote, Message };
