const Logger = require('./Logger');
const Block = require('./Block');
const Transaction = require('./Transaction');
const DEFAULT_DIFFICULTY = 2;
const MINING_REWARD = 150;

/**
 * BlockChain
 * @param {number} difficulty of the mining algorithm (how much zeros in the beginning should be)
 */
class BlockChain {
  constructor(difficulty = DEFAULT_DIFFICULTY) {
    const genesisBlock = this.createGenesisBlock();
    this.chain = {[genesisBlock.hash]: genesisBlock};
    this.latestBlockHash = genesisBlock.hash;
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
    return this.chain[this.latestBlockHash];
  }
  /**
   * Mine pending transactions
   * @param {string} miningRewardAddress Address to send reward
   */
  minePendingTransactions(miningRewardAddress) {
    const block = new Block({
      timestamp: Date.now().toString(),
      transactions: this.pendingTransactions,
      previousHash: this.getLatestBlock().hash
    });
    block.mine(this.difficulty);

    Logger.info("Block successfully mined");
    this.chain[block.hash] = block;
    this.latestBlockHash = block.hash;

    this.pendingTransactions = [
      new Transaction({ toAddress: miningRewardAddress, amount: this.miningReward })
    ]
  }
  /**
   * Create transaction and add it into pending list
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {
    if (!transaction || !transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');

    } else if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to the chain');
    }

    this.pendingTransactions.push(transaction);
  }
  /**
   * Get balance of the given address
   * @param {string} address
   * @returns {number}
   */
  getBalanceOfAddress(address) {
    if (!address) throw new Error('Specify the address to check!');

    let balance = 0;

    for (const hash in this.chain) {
      for (const transaction of this.chain[hash].transactions) {
        if (transaction.fromAddress === address) balance -= transaction.amount;
        if (transaction.toAddress === address) balance += transaction.amount;
      }
    }

    return balance;
  }
  /**
   * Check is chain valid
   */
  isChainValid() {
    // Check from 1 because the 1st one is Generic
    for (let hash in this.chain) {
      const currentBlock = this.chain[hash];
      const prevBlock = this.chain[currentBlock.previousHash];

      if (prevBlock) {
        if (!currentBlock.hasValidTransactions()) return false;
        else if (currentBlock.hash !== currentBlock.calculateHash()) return false;
        else if (currentBlock.previousHash !== prevBlock.calculateHash()) return false;
      }
    }
    return true;
  }
}

module.exports = BlockChain;
