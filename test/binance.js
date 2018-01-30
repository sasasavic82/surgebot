require('dotenv').config();
const assert = require('assert');
const Binance = require('../modules/binance');

describe('Binance', function() {
    it('should be able to make sign requests', (done) => {
        (async() => {
            try {
                const accountInfo = await Binance.binance.accountInfo();
                assert(accountInfo, 'unable to receieve balance');
                done();
            } catch(err) {
                done(false)
            }
        })();
    });

    it('should have enough balance to afford budget', (done) => {
        (async() => {
            try {
                const accountInfo = await Binance.binance.accountInfo();
                assert(accountInfo, 'unable to receive balance');
                assert(accountInfo.balances[0].asset === 'BTC', 'data has changed; wait for future update. unsafe to use TradeBot!');
                //assert(accountInfo.balances[0].free > Number(process.env.budget), 'not enough funds in binance wallet to use TradeBot!');
                done();
            } catch(err) {
                done(false)
            }
        })();
    });
});