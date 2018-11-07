import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const postSchema = new Schema(
    {
        messageId: Number,
        reactionOptions: [String],
        reactions: {
            type: Map,
            of: String,
            default: {},
        },
        created_at: { type: Date, default: Date.now },
    },
    { versionKey: false },
);

postSchema.methods.scores = function() {
    const acc = {
        ...this.reactionOptions.reduce((acc, v) => {
            acc[v] = 0;
            return acc;
        }, {}),
    };

    for (const v of this.reactions.values()) {
        if (this.reactionOptions.includes(v)) {
            acc[v] += 1;
        }
    }

    return acc;
};

postSchema.methods.addReaction = function({ key, reaction }) {
    this.reactions.set(key, reaction);
    return this.scores();
};

postSchema.methods.removeReaction = function(key) {
    this.reactions.delete(key);
    return this.scores();
};


export default mongoose.model('Post', postSchema);
