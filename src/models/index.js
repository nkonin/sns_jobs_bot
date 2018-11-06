import mongoose from 'mongoose';
import ActionLog from './actionLog';
import ErrorLog from './errorLog';
import MessageLog from './messageLog';
import Vote from './vote';
import Post from './post';
import {mongoUrl} from '../config'

mongoose
    .connect(
        mongoUrl,
        { useNewUrlParser: true },
    )
    .catch(err => console.error(err));

export { ActionLog, MessageLog, ErrorLog, Vote, Post };
