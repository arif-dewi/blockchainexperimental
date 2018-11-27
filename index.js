const Logger = require('./src/Logger');
const BlockChain = require('./src/BlockChain');
const Transaction = require('./src/Transaction');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const EC_ENCODING = 'hex';

const MY_KEY = ec.keyFromPrivate('22889c8652ae89aecd890cda663a977bb6f1ef5e96d9e1474ffc894e116aa256');
const MY_WALLET_ADDRESS = MY_KEY.getPublic(EC_ENCODING);

const JsCoinChain = new BlockChain();

const transaction1 = new Transaction({
  fromAddress: MY_WALLET_ADDRESS,
  toAddress: 'address1',
  amount: 100
});

transaction1.signTransaction(MY_KEY);
JsCoinChain.addTransaction(transaction1);
JsCoinChain.minePendingTransactions(MY_WALLET_ADDRESS);

const transaction2 = new Transaction({
  fromAddress: MY_WALLET_ADDRESS,
  toAddress: 'address2',
  amount: 50
});

transaction2.signTransaction(MY_KEY);
JsCoinChain.addTransaction(transaction2);
JsCoinChain.minePendingTransactions(MY_WALLET_ADDRESS);

Logger.info(`Balance of Andrei is: ${JsCoinChain.getBalanceOfAddress(MY_WALLET_ADDRESS)}`);
Logger.info(JSON.stringify(JsCoinChain, null, 2));

// JsCoinChain.chain[1].transactions[0].amount = 0;
Logger.info(`Is chain valid? ${JsCoinChain.isChainValid() ? 'Yes' : 'No'}`);
