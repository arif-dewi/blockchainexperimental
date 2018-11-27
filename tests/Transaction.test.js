import test from 'ava';
const Transaction = require('../src/Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const EC_ENCODING = 'hex';

const MY_KEY = ec.keyFromPrivate('22889c8652ae89aecd890cda663a977bb6f1ef5e96d9e1474ffc894e116aa256');
const MY_WALLET_ADDRESS = MY_KEY.getPublic(EC_ENCODING);

const testObject = {amount: 0, toAddress: 'address1', fromAddress: 'address2'};
const testTransaction = new Transaction(testObject);

const transaction1 = new Transaction({
  fromAddress: MY_WALLET_ADDRESS,
  toAddress: 'address1',
  amount: 100
});

test('constructor() should assign initial values', t => {
  t.is(testTransaction.amount, testObject.amount);
  t.is(testTransaction.toAddress, testObject.toAddress);
  t.is(testTransaction.fromAddress, testObject.fromAddress);
});

test('calculateHash() should return valid hash', t => {
  const expectedHash = '622336acbd2dbbad7585bcdf40d2844aa3e3902d23827a3f033ea1b7ca35109521e78623a755c2106e0f9f4305fe8605c8664e2dccaf3ea182448a503f55f3dd';
  t.is(testTransaction.calculateHash(), expectedHash);
});

test('signTransaction() should sign off transaction with a private key', t => {
  const expectedSignature = '3045022005f89cdad7b77efc0bd7c42f5eeb0f7c5f23f7fdf56300056571dd5edde58600022100e002efc34fc4f098047baaf194187ab1321cdec45f8a0dffb73c870836094e0e';

  transaction1.signTransaction(MY_KEY);

  t.is(transaction1.signature, expectedSignature)
});

test("signTransaction() should throw an Error when trying to sign off someone's wallet", t => {
  const error = t.throws(() => {
    testTransaction.signTransaction(MY_KEY);
  }, Error);

  t.is(error.message, "You can't sign transactions for other wallets!")
});

test("signTransaction() should throw an Error when no key is passed", t => {
  const error = t.throws(() => {
    testTransaction.signTransaction();
  }, Error);

  t.is(error.message, 'Key should be specified!')
});

test('isValid() should return true if fromAddress equals null', t => {
  const address = testTransaction.fromAddress;
  testTransaction.fromAddress = null;

  t.true(testTransaction.isValid());

  testTransaction.fromAddress = address;
});

test('isValid() should return true if fromAddress equals undefined', t => {
  const address = testTransaction.fromAddress;
  testTransaction.fromAddress = undefined;

  t.true(testTransaction.isValid());

  testTransaction.fromAddress = address;
});

test('isValid() should throw an error if there was no signature passed', t => {
  const error = t.throws(() => {
    testTransaction.isValid();
  }, Error);

  t.is(error.message, 'No signature in this transaction!')
});

test('isValid() should return true if the signature was used to sign off this transaction', t => {
  t.true(transaction1.isValid());
});
