const rp = require('request-promise');
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_NAME = process.env.TELEGRAM_CHANNEL;
const MY_CHAT = process.env.TELEGRAM_ADMIN_CHAT;
const registeredUsers = [MY_CHAT];

const sendToUser = async (chat_id, text, notify) => {
    const options = {
        method: 'GET',
        uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        qs: {
            chat_id,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: 'true',
            disable_notification: !notify
        },
        json: true
    };

    return rp(options);
}

const removeFromChat = async (messageId, chatId) => {
    const options = {
        method: 'GET',
        uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`,
        qs: {
            chat_id: chatId,
            message_id: messageId
        }
    };

    return rp(options);
}

exports.sendToAllRegisteredUsers = async message => {
    for(const chat of registeredUsers) {
        await sendToUser(chat, message);
    }
};

exports.sendToChannel = async (message, notify) => {
    return await sendToUser(CHANNEL_NAME, message, notify);
};

exports.removeFromChannel = async messageId => {
    await removeFromChat(messageId, CHANNEL_NAME);
};