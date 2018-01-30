# SurgeBot
    Bot that detects when a new coin is added to an exchange by monitoring social media (Twitter), and attempts to put in an order as the coin is getting added to the exchange (Binance). This will extend to other exchanges and social media sources.


IT IS NOT MY RESPONSIBILITY IF YOU GAIN/LOSE MONEY.  THERE IS NO SUCH THING AS PERFECT SOFTWARE.  PLEASE LOOK THROUGH THE CODEBASE/DOCUMENTATION TO UNDERSTAND THE RISKS YOU ARE TAKING.  

### Setup
1. Create an `.env` file in your projects root directory.
2. Copy and paste `template.env` into `.env`
3. Fill out *REQUIRED* environment variables
---> Sign up for Binance API here if you haven't already: https://www.binance.com/userCenter/createApi.html
---> Sign up for Twitter API here if you haven't already: https://apps.twitter.com/
---> Sign up for Twillio API here if you haven't already (optional, if you want to receive SMS notifications): https://www.twilio.com/try-twilio
4. `npm i`
5. `npm start`

### Documentation
##### `How it works`
SurgeBot monitors Binance's twitter account (`@binance_2017`) for a specific tweet type dedicated to announcing coin(s) about to be listed on it's platform. Once an announcement of a new coin is detected, SurgeBot extracts the currency symbol (i.e. ETH), and immediately starts querying Binance price and order APIs in an attempt to open a `BUY` order at the current *market value*. Once an order is placed, SurgeBot executes a profit strategy in an attempt to `SELL` for profit, back to `BINANCE_BASE_CURRENCY`. Price surges are often seen on Binance, when a new coin is about to be listed. If you can get an order in, you have a chance at making significant gains.

##### `.env`
- `BINANCE_BASE_CURRENCY` is the base currency you want to be trading with.
- `BINANCE_FEE` standard binance fee is `0.001`, but if you're using BNB, you're entitled to a fee reduction, thus you should change it to `0.0005`
- `BINANCE_PLACEMENT_PERCENTAGE` is a value between `0.0 - 1.0`. This is the value that determines how much of your existing `free BTC` you want to use, as the placement of your order.

##### `npm start`
This command runs tests before starting the bot. It then kicks off a loop where it monitors `@binance_2017` twitter account, and then subsequently tries to place order.

##### `Ctrl + C`
Pressing these two keys will terminate SurgeBot. WARNING: If a BUY order has been placed, you may kill of an attempt to execute a profit strategy, thereby holding a position in the newly listed coin.


### Issues?
Open up a ticket here to have a question answered or to report a bug: https://github.com/sasasavic82/surgebot/issues

### Donations
    BTC: 1CKY9w39ixKkjKh9stYeAfxm3whFazQRbJ
    LTC: LeifK4j3fHDgFWMuXueVCrNYJ1Fws4MP7X

Please reach out if you've made a donation!  Any donation will do, but >.001BTC to get listed as a supporter! Please don't be afraid to contribute

### Supporters
