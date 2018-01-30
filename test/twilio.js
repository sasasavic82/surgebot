const assert = require('assert');
const twilio = require('../modules/twilio');

const TWILIO_ENABLED = process.env.TWILIO_ENABLED === 'true' || process.env.TWILIO_ENABLED === 'TRUE';

TWILIO_ENABLED && describe('Twilio SMS API', function() {
    this.timeout(20000);
    it('should be able to send an SMS to', (done) => {
        (async() => {
            try {
                assert.equal(await twilio.sendText('[SurgeBot] Testing.'), 'text was not sent');
                done();
            } catch(err) {
                done(false);
            }
        })();
    });
});