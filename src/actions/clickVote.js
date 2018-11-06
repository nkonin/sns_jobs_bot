import Vote from '../models/vote';
import { scoresKeyboard } from '../utils';

export default () => async ctx => {
    const sourceMessage = ctx.update.callback_query.message.reply_to_message.message_id;
    const vote = await Vote.findOne({ sourceMessage });
    const userId = String(ctx.update.callback_query.from.id);

    if (vote.votes.get(userId) === ctx.state.value) {
        vote.removeVote(userId);
    } else {
        vote.addVote({ key: userId, value: ctx.state.value });
    }

    await vote.save();

    await ctx.editMessageReplyMarkup(scoresKeyboard({ scores: vote.scores(), action: 'CLICK_VOTE' }));
    await ctx.answerCbQuery(ctx.state.value);
};
