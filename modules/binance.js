
'use strict'

const _ = require('lodash');
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
        initializePrice: function(price) {
            this.prices.push(price);
            this.buyPrice = price;
            this.currentPrice = price;
        },
        swap: function(newPrice) {
            this.lastPrice = this.currentPrice;
            this.currentPrice = newPrice;
        }
    }
    this.ticker = null;
    this.priceDetected = false;

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

    } catch(e) {
      this._log(e);
    }
  }

  async coinDetected(coin) {
      this.surgedCoin = coin;
      this.pair = coin + this.config.baseCurrency;
      await this._coinOperational(async (price) => {
          await this._placeOrder('BUY', price);
          this._setupTicker();
      });
  }

  async _coinOperational(cb) {
      this.interval = setInterval(async () => {
          
          if(this.detectingPrice) return;
          
          this.detectingPrice = true;

          const price = (await this.binance.prices())[this.pair];

          if(!price) {
              this.detectingPrice = false;
              return;
          }

          clearInterval(this.interval);

          this.model.initializePrice(price);

          if(cb) cb(price);
      }, 500);
  }

  async _placeOrder(type, price) {

      this.processing = true;

      const quantity = this._calculateQuantityBasedOnBudget(price);

      console.log("QTY: " + quantity);

      const order = await this.binance.order({
          symbol: this.pair,
          type: 'MARKET',
          side: type,
          quantity: quantity
      });

      this._log(order);

      this.currentOrder = order;
      this.processing = false;
  }

  _setupTicker() {
      this.ticker = this.binance.ws.ticker(this.pair, async (ticker) => {
          if(!this.processing) await this._calculateProfitExit(ticker.curDayClose);
      });
  }

  async _calculateProfitExit(currentPrice) {

      this.processing = true;

      this.model.swap(currentPrice);

      if(this.model.currentPrice > this.model.lastPrice)
          this.model.movement.rising++;
      if(this.model.currentPrice < this.model.lastPrice)
          this.model.movement.falling++;

      var rateOfChange = this._rateOfChange(this.model.buyPrice, this.model.currentPrice);


      if(rateOfChange >= 0.20 && rateOfChange <= 0.40)
      {
          this._exit();
          await this._placeOrder('SELL', currentPrice);
      }

      /*

      let index = this.model.prices.length;
      this._log('Length: ' + index);

      if(this.model.prices[index-1] > this.model.prices[index-2])
          this.model.movement.rising++;
      if(this.model.prices[index-1] < this.model.prices[index-2])
          this.model.movement.falling++;

      var rateOfChange = this._rateOfChange(this.model.prices[0], this.model.prices[index-1]);
      
      */


      if(rateOfChange > 0.00 && (this.model.movement.rising >= this.model.movement.falling))
          this._log('Keep Going ... ');
      else  {

          if(rateOfChange > 0.00 && (this.model.movement.rising >= this.model.movement.falling))
              this._log('Perhaps sell...');
          else
              this._log('Better Hold');

      }
          

      this._log(this.model.movement);
      this._log(rateOfChange.toFixed(2));

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

  _exit() {
      if(this.ticker) this.ticker();
  }
}

module.exports = Binance;