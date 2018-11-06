import { Post } from '../models';
import { scoresKeyboard } from '../utils';

export default ({repostChannelId, reactionOptions}) => async ctx => {
    const post = new Post({
        reactionOptions: reactionOptions,
    });

    const res = await ctx.telegram.sendCopy(repostChannelId, ctx.update.message.reply_to_message, {
        ...scoresKeyboard({ scores: post.scores(), action: 'CLICK_REACTION' }).extra(),
    });

    post.messageId = res.message_id;
    await post.save();
};
