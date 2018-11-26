const Block = require('./Block');
const Transaction = require('./Transaction');
const DEFAULT_DIFFICULTY = 2;
const MINING_REWARD = 100;

/**
 * BlockChain
 * @param difficulty of the mining algorithm (how much zeros in the beginning should be)
 */
class BlockChain {
  constructor(difficulty = DEFAULT_DIFFICULTY) {
    // TODO: Rewrite using hash-table
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
    this.miningReward = MINING_REWARD;
  }
  /**
   * Create the very first genesis block
   * @returns {Block}
   */
  createGenesisBlock() {
    const genesisBlock = new Block({
      timestamp: Date.now().toString(),
      transactions: [],
      previousHash: '0',
      name: 'Genesis block'
    });

    genesisBlock.mine();

    return genesisBlock;
  }
  /**
   * Get the latest block
   * @returns {Block} latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  /**
   * Mine pending transactions
   * @param miningRewardAddress Address to send reward
   */
  minePendingTransactions(miningRewardAddress) {
    const block = new Block({
      timestamp: Date.now().toString(),
      transactions: this.pendingTransactions,
      previousHash: this.getLatestBlock().hash
    });
    block.mine(this.difficulty);

    console.log("Block successfully mined");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction({ toAddress: miningRewardAddress, amount: this.miningReward })
    ]
  }
  /**
   * Create transaction and add it into pending list
   * @param {Transaction} transaction
   */
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }
  /**
   * Get balance of the given address
   * @param address
   * @returns {number}
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) balance -= transaction.amount;
        if (transaction.toAddres === address) balance += transaction.amount;
      }
    }

    return balance;
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
