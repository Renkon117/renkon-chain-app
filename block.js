
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');


class Block {
    constructor({ timestamp, lastHash, hash, data, nounce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nounce = nounce;
        this.difficulty = difficulty;
    }


    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        const { difficulty } = lastBlock;
        let nounce = 0;

        do {
            nounce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lastHash, data, nounce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nounce,
            hash
        });
    }
}

module.exports = Block;