import Telegraf from 'telegraf';
import { onlyAdmin, errorLogger, actionLogger, messageLogger, chatFilter } from './middlewares';
import { reactionOptions, channelRepostId, allowedChatId, voteOptions, botToken } from './config';
import { accept, createVote, clickVote, clickReaction } from './actions';
import router from './router';

const bot = new Telegraf(botToken);

bot.telegram.getMe().then(botInfo => {
    bot.options.username = botInfo.username;
});

bot.on('message', messageLogger);

bot.filter(chatFilter(allowedChatId));

bot.command(
    'accept',
    errorLogger({ type: 'ACCEPT' }),
    actionLogger({
        type: 'ACCEPT',
        extraSelector: ctx => ({
            messageId: ctx.update.message.message_id,
        }),
    }),
    onlyAdmin,
    accept,
);

bot.hashtag(
    'vac',
    errorLogger({ type: 'CREATE_VOTE' }),
    actionLogger({
        type: 'CREATE_VOTE',
        extraSelector: ctx => ({
            messageId: ctx.update.message.message_id,
        }),
    }),
    createVote,
);

router.on(
    'CLICK_VOTE',
    errorLogger({ type: 'CLICK_VOTE' }),
    actionLogger({
        type: 'CLICK_VOTE',
        extraSelector: ctx => ctx.update.callback_query,
    }),
    clickVote,
);

router.on(
    'CLICK_REACTION',
    errorLogger({ type: 'CLICK_REACTION' }),
    actionLogger({
        type: 'CLICK_REACTION',
        extraSelector: ctx => ctx.update.callback_query,
    }),
    clickReaction,
);

bot.on('callback_query', router);

bot.startPolling();
