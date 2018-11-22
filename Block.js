const SHA3 = require("crypto-js/sha3");

/**
 * Block
 */
class Block {
  /**
   * Constructor
   * @param {number} [index]
   * @param {string} timestamp data
   * @param {*} data anything you want to store
   * @param {string} [previousHash] will be re-calculated automatically
   */
  constructor({index, timestamp, data, previousHash = ''}) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate hash
   * @returns {*}
   */
  calculateHash() {
    return SHA3(`${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}`).toString();
  }
}

module.exports = Block;
