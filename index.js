const TelegramBotApi = require('node-telegram-bot-api');

process.env["NTBA_FIX_350"] = 1;

const TOKEN = '5797842637:AAHj1TRS3YFZo_eqiX5eM1DatS-EoCJEj5g';

const bot = new TelegramBotApi(TOKEN, { polling: true });

bot.setMyCommands([
    { command: '/start', description: 'Запустити бота' },
    { command: '/menu', description: 'Переглянути меню' },
    { command: '/foryou', description: 'Переглянути акції' },
    { command: '/address', description: 'Мій адрес' },
])

const buttons = {
    reply_markup: JSON.stringify({
         inline_keyboard: [
             [{ text: 'Меню', callback_data: '/menu'}, { text: 'Акції', callback_data: '/foryou'}],
             [{ text: 'Адрес', callback_data: '/address'}],
         ]
    })
}

const showAddress = async (chatId) => {
    await bot.sendLocation(chatId, 49.84393424653144, 24.03231071534079);
    return bot.sendMessage(chatId, 'Тут тебе завжди чекають!')
}

const showMenu = (chatId) => {
    bot.sendPhoto(chatId, './images/menu_bar.png');
    return bot.sendMessage(chatId, `Меню`);
}

const showForYou = (chatId) => {
    return bot.sendMessage(chatId, `Акції`);
}

const start = () => {
    bot.on('message', async (message) => {
        const {
            text,
            chat: { id: chatId },
        } = message;
    
        if (text === '/start') {
            return bot.sendMessage(chatId, `Доброго дня ${message.from.first_name}`, buttons);
        }
        if (text === '/menu') {
            return showMenu(chatId);
        }
        if (text === '/foryou') {
           return showForYou(chatId);
        }
        if (text === '/address') {
           showAddress(chatId);
        }
        bot.sendMessage(chatId, `Не зрозумів тебе`);
    })

    bot.on('callback_query', (message) => {
        const {
            data,
            message: { chat: { id: chatId } }
        } = message;
        if (data === '/menu') {
            showMenu(chatId);
        };
        if (data === '/foryou') {
            showForYou(chatId);
        }
        if (data === '/address') {
            showAddress(chatId);
        }
    })
}

start(); 