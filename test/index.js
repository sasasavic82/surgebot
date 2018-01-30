require('dotenv').config();
const assert = require('assert');

before(function(done) {
    //validate binance
    assert(process.env.BINANCE_API_KEY, 'missing BINANCE_API_KEY from .env');
    assert(process.env.BINANCE_API_SECRET, 'missing BINANCE_API_SECRET from .env');
    assert(process.env.BINANCE_API_KEY.length === 64, 'invalid BINANCE_API_KEY from .env, please check for typos');
    assert(process.env.BINANCE_API_SECRET.length === 64, 'invalid BINANCE_API_SECRET from .env, please check for typos');

    //validate twitter
    assert(process.env.TWITTER_CONSUMER_KEY, 'missing TWITTER_CONSUMER_KEY from .env');
    assert(process.env.TWITTER_CONSUMER_SECRET, 'missing TWITTER_CONSUMER_SECRET from .env');
    assert(process.env.TWITTER_ACCESS_TOKEN, 'invalid TWITTER_ACCESS_TOKEN from .env, please check for typos');
    assert(process.env.TWITTER_ACCESS_TOKEN_SECRET, 'invalid TWITTER_ACCESS_TOKEN_SECRET from .env, please check for typos');

    //validate budget
    assert(process.env.BINANCE_BASE_CURRENCY, 'missing BINANCE_BASE_CURRENCY from .env -----> TIP: BINANCE_BASE_CURRENCY is usually BTC');
    assert(typeof Number(process.env.BINANCE_FEE) === 'number', 'invalid BINANCE_FEE from .env,  BINANCE_FEE should be only a number and can be up to the 8th decimal point');
    assert(typeof Number(process.env.BINANCE_PLACEMENT_PERCENTAGE) === 'number' && (Number(process.env.BINANCE_PLACEMENT_PERCENTAGE) >= 0.0 && Number(process.env.BINANCE_PLACEMENT_PERCENTAGE) <= 1.0), 'invalid BINANCE_PLACEMENT_PERCENTAGE from .env,  BINANCE_PLACEMENT_PERCENTAGE should be only be a 1 decimal fraction between 0.0 - 1.0');
    //validate twilio
    const TWILIO_ENABLED = process.env.TWILIO_ENABLED === 'true' || process.env.TWILIO_ENABLED === 'TRUE';

    if (TWILIO_ENABLED) {
        assert(process.env.TWILIO_ACCOUNT_SID, 'missing TWILIO_ACCOUNT_SID from .env');
        assert(process.env.TWILIO_AUTH_TOKEN, 'missing TWILIO_AUTH_TOKEN from .env');
        assert(process.env.TWILIO_FROM_NUMBER, 'missing TWILIO_FROM_NUMBER from .env');
        assert(process.env.TWILIO_TO_NUMBER, 'missing TWILIO_TO_NUMBER from .env');
        assert(process.env.TWILIO_ACCOUNT_SID.length === 34, 'invalid TWILIO_ACCOUNT_SID from .env , check for typos');
        assert(process.env.TWILIO_AUTH_TOKEN.length === 32, 'invalid TWILIO_AUTH_TOKEN from .env, check for typos');
        assert(process.env.TWILIO_FROM_NUMBER.length === 12, 'invalid TWILIO_FROM_NUMBER from .env, check for typos');
        assert(process.env.TWILIO_TO_NUMBER.length === 12, 'invalid TWILIO_TO_NUMBER from .env, check for typos');
    }

    // validate other
    assert(typeof Number(process.env.MONITORING_INTERVAL) === 'number', 'invalid MONITORING_INTERVAL from .env,  MONITORING_INTERVAL should be a number');
    //assert(typeof Number(process.env.TAKE_PROFIT_PERCENTAGE) === 'number' && (Number(process.env.TAKE_PROFIT_PERCENTAGE) >=1 && Number(process.env.TAKE_PROFIT_PERCENTAGE) <= 100), 'invalid TAKE_PROFIT_PERCENTAGE from .env,  TAKE_PROFIT_PERCENTAGE should be a number between 1 - 100');
    done();
});

after(function(done) {
    console.log('Validation & tests are successful! \n'
    + 'SurgeBot is active, and starting to monitor Twitter. \n'
    + 'Good luck!');
    done();
});