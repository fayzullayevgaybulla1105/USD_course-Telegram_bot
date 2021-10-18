const TelegramBot = require('node-telegram-bot-api')
const request = require('request')

// replace the value below with the Telegram token you receive from @BotFather

const token = 'Your telegram token';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/curse/, (msg, match) => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Выберите  какая валюта вас интересует ", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "€ - EUR",
                        callback_data: "EUR"
                    },
                    {
                        text: "$ - USD",
                        callback_data: "USD"
                    },
                    {
                        text: "₽ - RUB",
                        callback_data: "RUB"
                    },
                    {
                        text: "₺ - TRY",
                        callback_data: "TRY"
                    },
                    {
                        text: "￡ - GBP",
                        callback_data: "GBP"
                    },

                ]
            ]
        }
    });
});


bot.on('callback_query', query => {
    let id = query.message.chat.id
    request('https://cbu.uz/uz/arkhiv-kursov-valyut/json/', function (err, response, body) {
        const data = JSON.parse(body)
        // console.log(data);

        const result = data.filter(item => item.Ccy === query.data)[0]
        // console.log(result);
        const flag = {
            'EUR':"🇪🇺",
            'USD':"🇺🇲",
            'RUB':"🇷🇺",
            // 'SUM':"🇺🇿",
            'TRY':"🇹🇷",
            'GBP':"🇬🇧",
        }
        // console.log(flag.length);
        let obj = {name:"UZB", flag:"🇺🇿"}
        let md = `
           
        *${flag[result.Ccy]} ${result.Ccy} 💱 ${obj.name} ${obj.flag}*
    Bank : _${"Central Bank of Uzbekistan"}_
    Name : _${result.CcyNm_EN}_
    Buy : _${result.Rate}_
    Diff : _${result.Diff}_
    Date : _${result.Date}_
                `;
        bot.sendMessage(id, md, { parse_mode: "Markdown" })
    })
})