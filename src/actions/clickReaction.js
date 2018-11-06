import Message from '../models/message';
import { scoresKeyboard } from '../utils';

export default async ctx => {
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
};
