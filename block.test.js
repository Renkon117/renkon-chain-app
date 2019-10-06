
const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nounce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nounce, difficulty });


    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nounce).toEqual(nounce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        // console.log('genesisBlock', genesisBlock);

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('return a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash).toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nounce,
                    minedBlock.difficulty,
                    lastBlock.hash,
                    data
                )
            );
        });

        it('sets a `hash` that mathces the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100 })).toEqual(block.difficulty + 1);
        });
        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100 })).toEqual(block.difficulty - 1);
        });
    })
});