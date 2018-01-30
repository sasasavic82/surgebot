'use strict'

require('dotenv').config();

const Binance = require('./modules/binance');
const twilio = require('./modules/twilio');
const coin = require('./modules/coin');

const CONFIG = {
    baseCurrency: process.env.BINANCE_BASE_CURRENCY || 'BTC',
    fee: process.env.BINANCE_FEE || 0.0005,
    placementPercentage: process.env.BINANCE_PLACEMENT_PERCENTAGE | 1
};

(async (config) => {

    let bin = new Binance(config);

    await twilio.sendSms(`[SurgeBot] Initialized.`);

    coin.announced(async (announcement) => {
        let message = `[SurgeBot] Announced [$${announcement.coin}] on Binance. SurgeBot activated.`;
        //console.log(message);
        // If Twillio account enabled, send a message to a designated mobile number
        await twilio.sendSms(message);

        // Kickoff the Binance SurgeBot
        await bin.coinDetected(announcement.coin);
    });
    
})(CONFIG);