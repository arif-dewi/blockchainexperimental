const Block = require('./src/Block');
const BlockChain = require('./src/BlockChain');
const Transaction = require('./src/Transaction');
const MY_ADDRESS = 'andrei-address';

const JsCoinChain = new BlockChain();

JsCoinChain.createTransaction(new Transaction({ amount: 100, fromAddress: 'address1', toAddress: 'address2'}));
JsCoinChain.createTransaction(new Transaction({ amount: 50, fromAddress: 'address2', toAddress: 'address1'}));

console.log('\nStarting the miner...');
JsCoinChain.minePendingTransactions(MY_ADDRESS);
console.log('\nBalance of Andrei is:', JsCoinChain.getBalanceOfAddress(MY_ADDRESS));
console.dir(JsCoinChain);

console.log('.'.repeat(23));

console.log('\nStart the miner again...');
JsCoinChain.minePendingTransactions(MY_ADDRESS);
console.log('\nBalance of Andrei is:', JsCoinChain.getBalanceOfAddress(MY_ADDRESS));
console.dir(JsCoinChain);
