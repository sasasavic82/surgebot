
'use strict'

const _ = require('lodash');
const term = require('terminal-kit').terminal;
const date = require('dateformat');
const Stream = require('stream');
const slayer = require('slayer');

const BinanceApi = require('binance-api-node');

const binance = BinanceApi.default({
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_API_SECRET
});

class Binance {
    constructor(config) {
        this.config = config;
        this.binance = binance;
        this.model = {
            prices: [],
            buyPrice: 0,
            lastPrice: 0,
            currentPrice: 0,
            movement: {
                rising: 0,
                falling: 0
            },
            initializePrice: function (price) {
                this.prices.push(price);
                this.buyPrice = price;
                this.currentPrice = price;
            },
            swap: function (newPrice) {
                this.lastPrice = this.currentPrice;
                this.currentPrice = newPrice;
            }
        }
        this.orderIncrement = 0;
        this.ticker = null;
        this.priceDetected = false;
        this._initScreen();
        this._init();
    }

    async _init() {
        try {

            this.accountInfo = await this.binance.accountInfo();
            this.exchangeInfo = await this.binance.exchangeInfo();
            this.freeBudget =
                (Number(_.find(this.accountInfo.balances, {
                    'asset': this.config.baseCurrency
                }).free)).toFixed(8);
            this.netBudget =
                ((this.freeBudget * this.config.placementPercentage) - this.config.fee).toFixed(8);

            this._setupStreaming();

        } catch (e) {
            //this._log(e);
        }
    }

    static binance() {
        return binance;
    }

    _setupStreaming() {
        this.sourceFinancialStream = new Stream();
        this.sourceFinancialStream.readable = true;

        this.sourceFinancialStream
            .pipe(slayer().createReadStream())
            .on('error', err => console.error(err))
            .on('data', _detectProfitSpike);
    }

    async coinDetected(coin) {
        this._initScreen();
        this.surgedCoin = coin;
        this.pair = coin + this.config.baseCurrency;

        term.moveTo(1, 4, `^yDETECTED:^ ^#^g^w${coin}^ `);

        await this._coinOperational(async (price) => {
            await this._placeOrder('BUY', price);
            this._setupTicker();
        });
    }

    async _coinOperational(cb) {
        this.interval = setInterval(async () => {

            if (this.detectingPrice) return;

            this.detectingPrice = true;

            const price = (await this.binance.prices())[this.pair];

            if (!price) {
                term.moveTo(1, 5, `^yMARKET VALUE:^ ^rNone^`);
                this.detectingPrice = false;
                return;
            }

            term.moveTo(1, 5, `^yMARKET VALUE:^ ^g${price}^`);

            clearInterval(this.interval);

            this.model.initializePrice(price);

            if (cb) cb(price);
        }, 500);
    }

    async _placeOrder(type, price) {

        this.processing = true;

        const quantity = this._calculateQuantityBasedOnBudget(price);

        const order = await this.binance.order({
            symbol: this.pair,
            type: 'MARKET',
            side: type,
            quantity: quantity
        });

        term.moveTo(1, (7 + this.orderIncrement), `^#^b^w${type} ORDER^ ^yPRICE:^ ^w${price}^ ^yQUANTITY:^ ^w${quantity}^`);

        this.currentOrder = order;
        this.processing = false;
        this.orderIncrement++;
    }

    _setupTicker() {
        const sourceStream = new Stream();
        sourceStream.readable = true;
        this.ticker = this.binance.ws.ticker(this.pair, async (ticker) => {
            //this.sourceFinancialStream.emit('data', ticker.curDayClose);
            if (!this.processing) await this._calculateProfitExit(ticker.curDayClose);
        });
    }


    // TODO: This needs A LOT OF WORK - This is not at all a good take profit strategy
    //       I need to have a better way to calculate the best time to take profit.
    //
    //        Considerations:
    //        - Dump detection
    //        - How NOT to get out too early  \__ Goldilocks zone
    //        - How NOT to get out too late   /
    //        - spike detection (time series analysis - fourier transform)
    //

    async _detectProfitSpike(spike) {
        console.log(spike);
    }

    async _calculateProfitExit(currentPrice) {

        this.processing = true;
        
        //this.model.prices.push(currentPrice);

        this.model.swap(currentPrice);

        if (this.model.currentPrice > this.model.lastPrice)
            this.model.movement.rising++;
        if (this.model.currentPrice < this.model.lastPrice)
            this.model.movement.falling++;

        var rateOfChange = this._rateOfChange(this.model.buyPrice, this.model.currentPrice).toFixed(2);
        let termString = rateOfChange >= 0.00 ? `^#^g^w${rateOfChange}^` : `^#^r^w${rateOfChange}^`;
        term.moveTo(25, 5, `^yCHANGE:^ ${termString} ^yMOVEMENT:^s ^g${this.model.movement.rising} UP^ ^r${this.model.movement.falling} DOWN^`);

        if (rateOfChange >= Number(this.config.takeProfitPercentage).toExponential(2)) {
            this._exit();
            await this._placeOrder('SELL', currentPrice);
        }

        this.processing = false;

    }

    _rateOfChange(previousPrice, currentPrice) {
        return (currentPrice - previousPrice) / currentPrice * 100;
    }

    _calculateQuantityBasedOnBudget(price) {
        let quantity = 0;
        while (quantity * price <= this.netBudget) {
            quantity += 0.001;
        };
        return quantity.toFixed(2);
    }

    _log(text) {
        console.log(text);
    }

    _initScreen() {
        term.clear();
        //term.moveTo(1, 1, date(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"));
        term.moveTo(1, 2, `^#^b^wSurgeBot Initialized and ready!^`);
        term.moveTo(1, 4, `^yDETECTED:^ ^#^r^wNone^`);
    }

    _exit() {
        if (this.ticker) this.ticker();
    }
}

module.exports = Binance;