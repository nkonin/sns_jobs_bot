export default allowedChatId => ctx => {
    if (ctx.updateType === 'message') {
        return ctx.update.message.chat.id === allowedChatId;
    } else {
        return true;
    }
};
