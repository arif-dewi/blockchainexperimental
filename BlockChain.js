const Block = require('./Block');

/**
 * BlockChain
 */
class BlockChain {
  constructor() {
    // TODO: Rewrite using hash-table
    this.chain = [BlockChain.createGenesisBlock()];
  }

  /**
   * Create the very first genesis block
   * @returns {Block}
   */
  static createGenesisBlock() {
    return new Block({index: 0, timestamp: "01/01/2018", data: "Genesis Block", previousHash: "0"})
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

    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    // Some checks are here in the real world
    this.chain.push(newBlock);
  }
}

module.exports = BlockChain;
