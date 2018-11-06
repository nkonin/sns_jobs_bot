import Telegraf from 'telegraf';
import Extra from 'telegraf/extra';
import Router from 'telegraf/router';
import { Vote, Message } from './models';
import { onlyAdmin, errorLogger, actionLogger, messageLogger } from './middlewares';
import { scoresKeyboard } from './utils';
import { reactionOptions, channelRepostId, allowedChatId, voteOptions, botToken } from './config';

const bot = new Telegraf(botToken);

bot.telegram.getMe().then(botInfo => {
    bot.options.username = botInfo.username;
});

bot.on('message', messageLogger);

bot.filter(ctx => {
    if (ctx.updateType === 'message') {
        return ctx.update.message.chat.id === allowedChatId;
    } else {
        return true;
    }
});

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
    async ctx => {
        const message = new Message({
            reactionOptions: reactionOptions,
        });

        const res = await ctx.telegram.sendCopy(channelRepostId, ctx.update.message.reply_to_message, {
            ...scoresKeyboard({ scores: message.scores(), action: 'CLICK_REACTION' }).extra(),
        });

        message.sourceMessage = res.message_id;
        await message.save();
    },
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
    async ctx => {
        const vote = new Vote({
            sourceMessage: ctx.update.message.message_id,
            options: voteOptions,
        });

        vote.save();

        await ctx.reply('Vote', {
            ...Extra.inReplyTo(ctx.update.message.message_id),
            ...scoresKeyboard({ scores: vote.scores(), action: 'CLICK_VOTE' }).extra(),
        });
    },
);

const router = new Router(({ callbackQuery }) => {
    if (!callbackQuery.data) {
        return;
    }
    const data = JSON.parse(callbackQuery.data);
    return {
        route: data.action,
        state: data.state,
    };
});

router.on(
    'CLICK_VOTE',
    errorLogger({ type: 'CLICK_VOTE' }),
    actionLogger({
        type: 'CLICK_VOTE',
        extraSelector: ctx => ctx.update.callback_query,
    }),
    async ctx => {
        const sourceMessage = ctx.update.callback_query.message.reply_to_message.message_id;
        const vote = await Vote.findOne({ sourceMessage });
        const userId = String(ctx.update.callback_query.from.id);

        if (vote.votes.get(userId) == ctx.state.value) {
            vote.removeVote(userId);
        } else {
            vote.addVote({ key: userId, value: ctx.state.value });
        }

        await vote.save();

        await ctx.editMessageReplyMarkup(scoresKeyboard({ scores: vote.scores(), action: 'CLICK_VOTE' }));
        await ctx.answerCbQuery(ctx.state.value);
    },
);

router.on(
    'CLICK_REACTION',
    errorLogger({ type: 'CLICK_REACTION' }),
    actionLogger({
        type: 'CLICK_REACTION',
        extraSelector: ctx => ctx.update.callback_query,
    }),
    async ctx => {
        const sourceMessage = ctx.update.callback_query.message.message_id;
        const message = await Message.findOne({ sourceMessage });
        const userId = String(ctx.update.callback_query.from.id);

        if (message.reactions.get(ctx.state.value).includes(userId)) {
            message.removeReaction({ userId: userId, reaction: ctx.state.value });
        } else {
            message.addReaction({ userId: userId, reaction: ctx.state.value });
        }

        await message.save();

        await ctx.editMessageReplyMarkup(scoresKeyboard({ scores: message.scores(), action: 'CLICK_REACTION' }));
        await ctx.answerCbQuery(ctx.state.value);
    },
);

bot.on('callback_query', router);

bot.startPolling();
