import { Vote } from '../models';
import { scoresKeyboard } from '../utils';
import Extra from 'telegraf/extra';

export default ({voteOptions}) => async ctx => {
    const vote = new Vote({
        sourceMessage: ctx.update.message.message_id,
        options: voteOptions,
    });

    vote.save();

    await ctx.reply('Vote', {
        ...Extra.inReplyTo(ctx.update.message.message_id),
        ...scoresKeyboard({ scores: vote.scores(), action: 'CLICK_VOTE' }).extra(),
    });
};
