import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import Extra from 'telegraf/extra';
import Router from 'telegraf/router';
import { Vote, Message } from './models';
import logger from './logger'

const channelRepostId = process.env.FORWARD_CHANNEL_ID;
const voteButtons = ['👍', '👎', '😱'];

const voteKeyboard = scores =>
    Markup.inlineKeyboard(
        Object.keys(scores).map(key => {
            const data = JSON.stringify({
                action: 'click_vote',
                state: {
                    value: key,
                },
            });

            return Markup.callbackButton(`${key} ${scores[key]}`, data);
        }),
    ).extra();

const reactionsKeyboard = scores =>
    Markup.inlineKeyboard(
        Object.keys(scores).map(key => {
            const data = JSON.stringify({
                action: 'click_reaction',
                state: {
                    value: key,
                },
            });

            return Markup.callbackButton(`${key} ${scores[key]}`, data);
        }),
    ).extra();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch(async error => {
    logger.error({type: "GLOBAL", error})
});

bot.on('message', async (ctx, next)=>{
    logger.message({data: ctx.update})
    next()
})

bot.command('accept', async ctx => {
    try {
        // TODO: Use reply message as target
        const message = new Message({
            reactionOptions: ['👍', '🙊', '😱'],
        });

        const res = await ctx.telegram.sendMessage(channelRepostId, 'ast', {
            ...reactionsKeyboard(message.scores()),
        });

        message.sourceMessage = res.message_id;
        await message.save();
    } catch (error) {
        logger.error({type: 'ACCEPT_MESSAGE', error})
    }
});

bot.hashtag('vac', async ctx => {
    try {
        const vote = new Vote({
            sourceMessage: ctx.update.message.message_id,
            options: voteButtons,
        });

        vote.save();

        const res = await ctx.reply('Vote', {
            ...Extra.inReplyTo(ctx.update.message.message_id),
            ...voteKeyboard(vote.scores()),
        });
    } catch (error) {
        logger.error({type: 'CREATE_VOTE_VACANCY', error})
    }
});

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

router.on('click_vote', async ctx => {
    try {
        const sourceMessage = ctx.update.callback_query.message.reply_to_message.message_id;
        const vote = await Vote.findOne({ sourceMessage });
        const userId = String(ctx.update.callback_query.from.id);

        if (vote.votes.get(userId) == ctx.state.value) {
            vote.removeVote(userId);
            await vote.save();

            await ctx.editMessageText('vote', voteKeyboard(vote.scores()));
            await ctx.answerCbQuery(ctx.state.value);
        } else {
            vote.addVote({ key: userId, value: ctx.state.value });
            await vote.save();

            await ctx.editMessageText('vote', voteKeyboard(vote.scores()));
            await ctx.answerCbQuery(ctx.state.value);
        }
    } catch (error) {
        logger.error({type: 'CLICK_VOTE', error})
    }
});

router.on('click_reaction', async ctx => {
    try {
        const sourceMessage = ctx.update.callback_query.message.message_id;
        const message = await Message.findOne({ sourceMessage });
        const userId = String(ctx.update.callback_query.from.id);

        if (message.reactions.get(ctx.state.value).includes(userId)) {
            message.removeReaction({ userId: userId, reaction: ctx.state.value });
            await message.save();

            await ctx.editMessageText('vote', reactionsKeyboard(message.scores()));
            await ctx.answerCbQuery(ctx.state.value);
        } else {
            message.addReaction({ userId: userId, reaction: ctx.state.value });
            await message.save();

            await ctx.editMessageText('vote', reactionsKeyboard(message.scores()));
            await ctx.answerCbQuery(ctx.state.value);
        }
    } catch (error) {
        logger.error({type: 'CLICK_REACTION', error})
    }
});

bot.on('callback_query', router);

bot.startPolling();
