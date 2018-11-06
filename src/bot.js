import Telegraf from 'telegraf';
import router from './router';
import { onlyAdmin, errorLogger, actionLogger, messageLogger, chatFilter } from './middlewares';
import { createPost, createVote, clickVote, clickReaction } from './actions';
import {
    allowedChatId,
    botToken,
    vacancyHashtag,
    acceptCommand,
    repostChannelId,
    voteOptions,
    reactionOptions,
} from './config';

const bot = new Telegraf(botToken);

bot.telegram.getMe().then(botInfo => {
    bot.options.username = botInfo.username;
});

bot.on('message', messageLogger);

bot.filter(chatFilter(allowedChatId));

bot.command(
    acceptCommand,
    errorLogger({ type: 'ACCEPT' }),
    actionLogger({
        type: 'ACCEPT',
        extraSelector: ctx => ({
            messageId: ctx.update.message.message_id,
        }),
    }),
    onlyAdmin,
    createPost({ repostChannelId, reactionOptions }),
);

bot.hashtag(
    vacancyHashtag,
    errorLogger({ type: 'CREATE_VOTE' }),
    actionLogger({
        type: 'CREATE_VOTE',
        extraSelector: ctx => ({
            messageId: ctx.update.message.message_id,
        }),
    }),
    createVote({ voteOptions }),
);

router.on(
    'CLICK_VOTE',
    errorLogger({ type: 'CLICK_VOTE' }),
    actionLogger({
        type: 'CLICK_VOTE',
        extraSelector: ctx => ctx.update.callback_query,
    }),
    clickVote(),
);

router.on(
    'CLICK_REACTION',
    errorLogger({ type: 'CLICK_REACTION' }),
    actionLogger({
        type: 'CLICK_REACTION',
        extraSelector: ctx => ctx.update.callback_query,
    }),
    clickReaction(),
);

bot.on('callback_query', router);

bot.startPolling();
