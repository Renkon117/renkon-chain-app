const PubNub = require('pubnub');
require('dotenv').config();

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY
};

const CHANNELS = {
    TEST: 'TEST',
}

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });

        this.pubnub.addListener(this.listner());
    }

    listner() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
            }
        };
    }


    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}

const testPubSub = new PubSub();
testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;

