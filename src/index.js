import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import Extra from 'telegraf/extra';
import Router from 'telegraf/router';
import { Vote } from './models';

const voteButtons = ['👍', '👎'];

const voteKeyboard = (scores) => Markup.inlineKeyboard(
    Object.keys(scores).map(key => {
        const data = JSON.stringify({
            action: 'click',
            state: {
                value: key,
            },
        });

        return Markup.callbackButton(`${key}:${scores[key]}`, data);
    })
).extra();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch(err => {
    console.log('Ooops', err);
});

bot.hashtag('vac', async ctx => {
    const vote = new Vote({
        sourceMessage: ctx.update.message.message_id,
        options: voteButtons
    });

    await vote.save();

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

router.on('click', async ctx => {
    const sourceMessage = ctx.update.callback_query.message.reply_to_message.message_id;
    const vote = await Vote.findOne({ sourceMessage });
    const user = ctx.update.callback_query.from.id;

    vote.addVote({ key: String(user), value: ctx.state.value });

    await vote.save()
    await ctx.editMessageText('vote', voteKeyboard(vote.scores()))
    await ctx.answerCbQuery(ctx.state.value);
});

bot.on('callback_query', router)

bot.startPolling();
