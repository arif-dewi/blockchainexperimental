import BlockChain from '../src/BlockChain';
import Transaction from '../src/Transaction';
import cloneDeep from 'lodash/cloneDeep';

import test from 'ava';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const EC_ENCODING = 'hex';

const MY_KEY = ec.keyFromPrivate('22889c8652ae89aecd890cda663a977bb6f1ef5e96d9e1474ffc894e116aa256');
const MY_WALLET_ADDRESS = MY_KEY.getPublic(EC_ENCODING);

const TestBlockChain = new BlockChain();
const transaction1 = new Transaction({
  fromAddress: MY_WALLET_ADDRESS,
  toAddress: 'address1',
  amount: 100
});

transaction1.signTransaction(MY_KEY);

test('constructor() should create Genesis block', t => {
  t.is(TestBlockChain.chain[TestBlockChain.latestBlockHash].name, 'Genesis block');
});

test('createGenesisBlock() should return Genesis block', t => {
  const genesisBlock = TestBlockChain.createGenesisBlock();
  t.is(genesisBlock.name, 'Genesis block');
  // Clear up test chain
  delete TestBlockChain.chain[genesisBlock.hash];
});

test('getLatestBlock() should return the latest block', t => {
  t.is(TestBlockChain.getLatestBlock().hash, TestBlockChain.latestBlockHash);
});

test('minePendingTransactions() should run mining the pending blocks and add them to the chain', t => {
  const CHAIN_LENGTH = 2;
  const transaction1 = new Transaction({
    fromAddress: MY_WALLET_ADDRESS,
    toAddress: 'address1',
    amount: 100
  });

  transaction1.signTransaction(MY_KEY);
  TestBlockChain.addTransaction(transaction1);
  TestBlockChain.minePendingTransactions(MY_WALLET_ADDRESS);

  t.is(Object.keys(TestBlockChain.chain).length, CHAIN_LENGTH);
});


test('isChainValid() should return true if this is the case', t => {
  t.true(TestBlockChain.isChainValid());
});

test('isChainValid() should return false if chain has been hacked', t => {
  const blockToRestore = cloneDeep(TestBlockChain.chain[TestBlockChain.latestBlockHash]);

  TestBlockChain.chain[TestBlockChain.latestBlockHash].transactions[0].amount = 0;
  TestBlockChain.chain[TestBlockChain.latestBlockHash].calculateHash();

  t.false(TestBlockChain.isChainValid());

  TestBlockChain.chain[TestBlockChain.latestBlockHash] = blockToRestore;
});

test('isChainValid() should return false if hash has been hacked', t => {
  const index = 0;
  const blockToRestore = cloneDeep(TestBlockChain.chain[TestBlockChain.latestBlockHash]);

  TestBlockChain.chain[TestBlockChain.latestBlockHash].hash = '123';
  const result = TestBlockChain.isChainValid();

  t.false(result);

  TestBlockChain.chain[index] = blockToRestore;
});

test('isChainValid() should return false if previousHash has been hacked', t => {
  const index = 0;
  const blockToRestore = cloneDeep(TestBlockChain.chain[TestBlockChain.latestBlockHash]);

  TestBlockChain.chain[TestBlockChain.latestBlockHash].previousHash = '123';
  const result = TestBlockChain.isChainValid();

  t.false(result);

  TestBlockChain.chain[index] = blockToRestore;
});

test('addTransaction() should add transaction to pendingTransactions if valid', t => {
  TestBlockChain.addTransaction(transaction1);
  t.is(TestBlockChain.pendingTransactions[TestBlockChain.pendingTransactions.length - 1], transaction1);
});

test('addTransaction() should throw an error if no transaction was passed', t => {
  const error = t.throws(() => {
    TestBlockChain.addTransaction();
  }, Error);

  t.is(error.message, 'Transaction must include from and to address')
});

test('addTransaction() should throw an error if transaction has no fromAddress', t => {
  const error = t.throws(() => {
    TestBlockChain.addTransaction(new Transaction({
      toAddress: 'address1',
      amount: 100
    }));
  }, Error);

  t.is(error.message, 'Transaction must include from and to address')
});

test("addTransaction() should throw an error if transaction isn't valid", t => {
  const transaction  = new Transaction({
    fromAddress: MY_WALLET_ADDRESS,
    toAddress: 'address1',
    amount: 100
  });
  transaction.signTransaction(MY_KEY);
  // Trying to break it
  transaction.amount = 10;

  const error = t.throws(() => {
    TestBlockChain.addTransaction(transaction);
  }, Error);

  t.is(error.message, 'Cannot add invalid transaction to the chain')
});

test('addTransaction() should throw an error if transaction has no toAddress', t => {
  const error = t.throws(() => {
    TestBlockChain.addTransaction(new Transaction({
      fromAddress: 'address1',
      amount: 100
    }));
  }, Error);

  t.is(error.message, 'Transaction must include from and to address')
});

test('getBalanceOfAddress() should return the balance for the given address', t => {
  TestBlockChain.minePendingTransactions(MY_WALLET_ADDRESS);

  t.is(TestBlockChain.getBalanceOfAddress('address1'), 300);
});

test('getBalanceOfAddress() should throw an error if no address was passed', t => {
  const error = t.throws(() => {
    TestBlockChain.getBalanceOfAddress();
  }, Error);

  t.is(error.message, 'Specify the address to check!')
});
