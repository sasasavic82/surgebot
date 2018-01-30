
const Twilio = require('twilio');
let twilio;

const TWILIO_ENABLED = process.env.TWILIO_ENABLED === 'true' || process.env.TWILIO_ENABLED === 'TRUE';

if (TWILIO_ENABLED) {
    twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

module.exports = TWILIO = {};

TWILIO.sendSms = function(message) {
    if (!TWILIO_ENABLED) { return; }
    return new Promise((res, rej) => {
        const config = { body: message, to: process.env.TWILIO_TO_NUMBER, from: process.env.TWILIO_FROM_NUMBER };
        twilio.messages.create(config)
            .then((message) => { res(true); })
            .catch((err) => { rej(false); })
    });
};