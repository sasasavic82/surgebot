const Twitter = require('monitor-twitter');

const MONITORING_INTERVAL = Number(process.env.MONITORING_INTERVAL * 1000);

const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = TWITTER = {};

TWITTER.monitor = (user, pattern, cb) => {
    twitter.start(user, pattern, MONITORING_INTERVAL);
    twitter.on(user, (tweet) => {
        cb(tweet);
    });
};

