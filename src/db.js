import { Vote } from './models';

const vote = new Vote({
    sourceMessage: '123',
});

async function create() {
    vote.addVote({ key: '1', value: '1' });
    vote.addVote({ key: '2', value: '2' });
    vote.addVote({ key: '3', value: '1' });
    vote.addVote({ key: '4', value: '2' });

    console.log(vote.scores());
    vote.removeVote('4');
    console.log(vote.scores());
}

create().catch(console.log);
