const SHA3 = require("crypto-js/sha3");
const DEFAULT_DIFFICULTY = 2;
/**
 * Block
 */
class Block {
  /**
   * Constructor
   * @param {string} timestamp data
   * @param {Array<Transaction>} transactions
   * @param {string} [previousHash] will be re-calculated automatically
   * @param {string} [name] of the block
   */
  constructor({timestamp, transactions, previousHash = '', name = ''}) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.name = name;
  }
  /**
   * Calculate hash
   * @returns {*}
   */
  calculateHash() {
    return SHA3(`${this.previousHash}${this.timestamp}${JSON.stringify(this.transactions)}${this.nonce}`).toString();
  }
  /**
   * Mine the block
   * @param [difficulty]
   */
  mine(difficulty = DEFAULT_DIFFICULTY) {
    // Iterate until has has a required  amount of zeros in the beginning
    while(this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined:", this.hash);
    return this.hash;
  }
}

module.exports = Block;
