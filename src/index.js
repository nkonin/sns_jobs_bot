import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import Extra from 'telegraf/extra';
import Router from 'telegraf/router';
import { Vote, Message } from './models';

const channelRepostId = process.env.FORWARD_CHANNEL_ID

const voteButtons = ['👍', '👎'];

const voteKeyboard = scores => Markup.inlineKeyboard(
    Object.keys(scores).map(key => {
        const data = JSON.stringify({
            action: 'click_vote',
            state: {
                value: key,
            },
        });

        return Markup.callbackButton(`${key} ${scores[key]}`, data);
    })
).extra();

const reactionsKeyboard = scores => Markup.inlineKeyboard(
    Object.keys(scores).map(key => {
        const data = JSON.stringify({
            action: 'click_reaction',
            state: {
                value: key,
            },
        });

        return Markup.callbackButton(`${key} ${scores[key]}`, data);
    })
).extra();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch(err => {
    console.log('Ooops', err);
});

bot.command('repost', async ctx => {
    const message = new Message({
        reactionOptions: voteButtons
    });

    const res = await ctx.reply('ast', {
        ...reactionsKeyboard(message.scores())
    })

    message.sourceMessage = res.message_id
    await message.save();
});

bot.hashtag('vac', async ctx => {
    const vote = new Vote({
        sourceMessage: ctx.update.message.message_id,
        options: voteButtons
    });

    ctx.reply('Vote', {
        ...Extra.inReplyTo(ctx.update.message.message_id),
        ...voteKeyboard(vote.scores()),
    });
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
    const sourceMessage = ctx.update.callback_query.message.reply_to_message.message_id;
    const vote = await Vote.findOne({ sourceMessage });
    const user = ctx.update.callback_query.from.id;

    vote.addVote({ key: String(user), value: ctx.state.value });

    await vote.save()
    await ctx.editMessageText('vote', voteKeyboard(vote.scores()))
    await ctx.answerCbQuery(ctx.state.value);
});

router.on('click_reaction', async ctx => {
    const sourceMessage = ctx.update.callback_query.message.message_id;
    const message = await Message.findOne({ sourceMessage });
    const user = ctx.update.callback_query.from.id;

    message.addReaction({ userId: String(user), reaction: ctx.state.value });

    await message.save()
    await ctx.editMessageText('vote', reactionsKeyboard(message.scores()))
    await ctx.answerCbQuery(ctx.state.value);
});

bot.on('callback_query', router)

bot.startPolling();
