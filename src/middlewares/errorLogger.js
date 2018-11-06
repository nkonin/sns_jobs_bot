import {ErrorLog} from '../models';

export default ({ type }) => async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.error(error);
        await ErrorLog.create({ type, error });
    }
};
