const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-a50d558a-70f1-4d4f-b8a1-89d29deacce9',
    subscribeKey: 'sub-c-e16c0868-e97b-11e9-914e-0a6be83abca1',
    secretKey: 'sec-c-Nzc0YTliYzAtZDYwMi00ZGU3LTk1NjgtYTVkNmRjZjU0MjY3'
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

