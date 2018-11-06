import mongoose from 'mongoose';
import ActionLog from './actionLog';
import ErrorLog from './errorLog';
import MessageLog from './messageLog';
import Vote from './vote';
import Message from './message';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/sns_jobs_bot';

mongoose
    .connect(
        url,
        { useNewUrlParser: true },
    )
    .catch(err => console.error(err));

export { ActionLog, MessageLog, ErrorLog, Vote, Message };
