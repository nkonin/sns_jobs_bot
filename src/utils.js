import Markup from 'telegraf/markup';

export const scoresKeyboard = ({ scores, action }) =>
    Markup.inlineKeyboard(
        Object.keys(scores).map(key => {
            const data = JSON.stringify({
                action: action,
                state: {
                    value: key,
                },
            });

            return Markup.callbackButton(`${key} ${scores[key]}`, data);
        }),
    );
