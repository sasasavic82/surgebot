const twitter = require('./twitter');

// Regular Expression that matches binance listing string #Binance Lists #TokenName ($TOKEN)
const REGEX = /^#Binance Lists .*\(\$([^\)]+)\)/g;
const BINANCE_TWITTER_ACCOUNT = process.env.BINANCE_TWITTER_ACCOUNT;
const BINANCE_BASE_CURRENCY = process.env.BINANCE_BASE_CURRENCY;

module.exports = CRYPTO = {};

CRYPTO.announced = (cb) => {
    twitter.monitor(BINANCE_TWITTER_ACCOUNT, REGEX, (tweet) => {
        let pattern = REGEX.exec(tweet.text);
        cb({
            text: pattern[0],
            coin: pattern[1]
        });
    });
};



