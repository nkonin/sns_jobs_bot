import { MessageLog, ActionLog, ErrorLog } from './models';

const error = ({ type, extra }) => ErrorLog.create({ type, extra });

const action = ({ type, extra }) => ActionLog.create({ type, extra });

const message = ({ data }) => MessageLog.create({ data });

export default { error, action, message };
