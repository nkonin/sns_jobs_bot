import { Message } from '../models';
import { repostChannelId, reactionOptions } from '../config';
import { scoresKeyboard } from '../utils';

export default async ctx => {
    const message = new Message({
        reactionOptions: reactionOptions,
    });

    const res = await ctx.telegram.sendCopy(repostChannelId, ctx.update.message.reply_to_message, {
        ...scoresKeyboard({ scores: message.scores(), action: 'CLICK_REACTION' }).extra(),
    });

    message.sourceMessage = res.message_id;
    await message.save();
};
