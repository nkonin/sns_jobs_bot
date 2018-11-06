import { MessageLog } from '../models';

export default async (ctx, next) => {
    await MessageLog.create({ data: ctx.update });
    return next();
};
