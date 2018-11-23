const Block = require('./Block');
const DEFAULT_DIFFICULTY = 2;

/**
 * BlockChain
 * @param difficulty of the mining algorithm (how much zeros in the beginning should be)
 */
class BlockChain {
  constructor(difficulty) {
    // TODO: Rewrite using hash-table
    this.chain = [];
    this.difficulty = difficulty || DEFAULT_DIFFICULTY;
    this.createGenesisBlock();
  }
  /**
   * Create the very first genesis block
   * @returns {Block}
   */
  createGenesisBlock() {
    const genesisBlock = new Block({index: 0, timestamp: "01/01/2018", data: "Genesis Block", previousHash: "0"})
    return this.addBlock(genesisBlock);
  }
  /**
   * Get the latest block
   * @returns {Block} latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  /**
   * Add new block to the chain
   * @param {Block} newBlock
   */
  addBlock(newBlock) {
    if (!newBlock || !(newBlock instanceof Block)) return null;

    console.log(`Mining block ${newBlock.index}...`);

    const latestBlock = this.getLatestBlock();
    newBlock.previousHash = latestBlock ? latestBlock.hash : null;
    newBlock.mine(this.difficulty);
    // Some checks are here in the real world
    this.chain.push(newBlock);
    return newBlock;
  }
  /**
   * Check is chain valid
   */
  isChainValid() {
    const chainLength = this.chain.length;
    // Check from 1 because the 1st one is Generic
    for (let i = 1; i < chainLength; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      else if (currentBlock.previousHash !== prevBlock.hash) return false;
    }
    return true;
  }
}

module.exports = BlockChain;
