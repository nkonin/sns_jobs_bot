import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const postSchema = new Schema(
    {
        messageId: Number,
        reactionOptions: [String],
        reactions: {
            type: Map,
            of: [String],
            default: function() {
                return this.reactionOptions.reduce((acc, v) => {
                    acc[v] = [];
                    return acc;
                }, {});
            },
        },
        created_at: { type: Date, default: Date.now },
    },
    { versionKey: false },
);

postSchema.methods.scores = function() {
    return this.reactionOptions.reduce((acc, v) => {
        acc[v] = this.reactions.get(v).length;
        return acc;
    }, {});
};

postSchema.methods.addReaction = function({ userId, reaction }) {
    if (!this.reactions.get(reaction).includes(userId)) {
        this.reactions.get(reaction).push(userId);
    }
    return this.scores();
};

postSchema.methods.removeReaction = function({ userId, reaction }) {
    this.reactions.set(reaction, this.reactions.get(reaction).filter(el => el !== userId));
    return this.scores();
};

export default mongoose.model('Post', postSchema);
