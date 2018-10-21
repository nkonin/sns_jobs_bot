import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import Extra from 'telegraf/extra';
import { Vote } from './models';

const voteKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('👍', 'VOTE_UP'),
    Markup.callbackButton('👎', 'VOTE_DOWN'),
]).extra();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hashtag('vac', async ctx => {
    const vote = new Vote({
        sourceMessage: ctx.update.message.message_id,
    });

    try {
        await vote.save();
    } catch (e) {
        console.log(e);
    }

    ctx.reply('Vote', {
        ...Extra.inReplyTo(ctx.update.message.message_id),
        ...voteKeyboard,
    });
});

bot.action('VOTE_UP', async ctx => {
    try {
        const sourceMessage = ctx.update.callback_query.message.reply_to_message.message_id;
        const vote = await Vote.findOne({ sourceMessage });
        const user = ctx.update.callback_query.from.id
        vote.addVote({key: String(user), value: '👍'})
        await ctx.answerCbQuery('👍');

        console.log(vote)
    } catch (e) {
        console.log(e)
    }
});

bot.action('VOTE_DOWN', async (ctx, next) => {
    await ctx.answerCbQuery('👎');
    next();
});

bot.startPolling();
