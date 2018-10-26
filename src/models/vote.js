import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const voteSchema = new Schema({
    sourceMessage: Number,
    options: [String],
    votes: {
        type: Map,
        of: String,
        default: {},
    },
    created_at: { type: Date, default: Date.now },
});

voteSchema.methods.scores = function() {
    const acc = {
        ...this.options.reduce((acc, v) => {
            acc[v] = 0;
            return acc;
        }, {}),
    };

    for (const v of this.votes.values()) {
        if (this.options.includes(v)) {
            acc[v] += 1
        }
    }

    return acc;
};

voteSchema.methods.addVote = function({ key, value }) {
    this.votes.set(key, value);
    return this.scores();
};

voteSchema.methods.removeVote = function(key) {
    this.votes.delete(key);
    return this.scores();
};

export default mongoose.model('Votes', voteSchema);
