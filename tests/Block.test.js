import Block from '../src/Block';
import test from 'ava';
const Transaction = require('../src/Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const EC_ENCODING = 'hex';

const MY_KEY = ec.keyFromPrivate('22889c8652ae89aecd890cda663a977bb6f1ef5e96d9e1474ffc894e116aa256');
const MY_WALLET_ADDRESS = MY_KEY.getPublic(EC_ENCODING);

const transaction1 = new Transaction({
  fromAddress: MY_WALLET_ADDRESS,
  toAddress: 'address1',
  amount: 100
});
transaction1.signTransaction(MY_KEY);

const testObject = {timestamp: '12345', transactions: [transaction1]};
const testBlock = new Block(testObject);

test('constructor()', t => {
  t.is(testObject.index, testBlock.index);
  t.is(testObject.timestamp, testBlock.timestamp);
  t.is(testObject.data, testBlock.data);
});

test('calculateHash()', t => {
  const hash = testBlock.calculateHash();
  const expectedHash = 'd1675f111ba8ff69819c0e5f88a301b19cb65a426e1d5fc605844f22d664d828d4ba254aea168105a7ad1d82cacc29ddc0a7f2f83195dd9bb9e7dab3a65e62ab';
  t.is(hash, expectedHash);
});

test('mine() should create a hash with the specified amount of zeros at the beginning', t => {
  const DIFFICULTY = 2;
  const hash = testBlock.mine(DIFFICULTY);

  t.is(hash.substring(0, DIFFICULTY), new Array(DIFFICULTY + 1).join('0'));
});

test('mine() should work correctly without specifying a "difficulty"', t => {
  const DIFFICULTY = 2;
  const hash = testBlock.mine();

  t.is(hash.substring(0, DIFFICULTY), new Array(DIFFICULTY + 1).join('0'));
});

test('hasValidTransactions() should return true if all transactions are valid', t => {
  t.true(testBlock.hasValidTransactions());
});

