import {Post} from '../models';
import { scoresKeyboard } from '../utils';

export default () => async ctx => {
    const messageId = ctx.update.callback_query.message.message_id;
    const post = await Post.findOne({ messageId });
    const userId = String(ctx.update.callback_query.from.id);

    if (post.reactions.get(ctx.state.value).includes(userId)) {
        post.removeReaction({ userId: userId, reaction: ctx.state.value });
    } else {
        post.addReaction({ userId: userId, reaction: ctx.state.value });
    }

    await post.save();

    await ctx.editMessageReplyMarkup(scoresKeyboard({ scores: post.scores(), action: 'CLICK_REACTION' }));
    await ctx.answerCbQuery(ctx.state.value);
};
