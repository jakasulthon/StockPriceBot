"use strict";
const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");
// Change the 'insert bot API token here' with your Telegram Bot API Token that you received when you created new bot in @BotSupport
const bot = new Telegraf("insert bot API token here");
// Change the 'demo' value below with AlphaVantage API Token received when you requested the free API access in AlphaVantage
let url =
  "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&interval=5min&apikey=demo";
bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello from your own StockPrice bot. Please input your desired ticker symbol, for example .GOOG or .AAPL."
  );
});
bot.hears(/([.])\w{0,4}/, async (ctx) => {
  let final_uri = url + `&symbol=${ctx.message.text.substring(1)}`;
  let today = new Date(ctx.message.date * 1000);
  let formattedDate =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    // You can change the today.getDate() with subtraction by 1, addition by 1, or not at all
    // based on what is your timezone. Currently the default timezone is Eastern Time of US
    (today.getDate() - 1);
  fetch(final_uri)
    .then((response) => response.json())
    .then((data) => {
      ctx.reply(
        "The stock price of " +
          data["Meta Data"]["2. Symbol"] +
          " as for today is " +
          parseFloat(
            data["Monthly Time Series"][formattedDate][
              // if the code is showing error then you can change ["4. close"] with ["1. open"] so it would works
              "4. close"
            ]
          ) +
          " USD"
      );
    });
});
bot.launch();
