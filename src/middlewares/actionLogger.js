import { ActionLog } from '../models';

export default ({ type, extraSelector = ctx => ctx.update }) => async (ctx, next) => {
    await ActionLog.create({ type, extra: extraSelector(ctx) });

    return next();
};
