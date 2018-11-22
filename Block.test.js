import Block from './Block';
import test from 'ava';

const testObject = {index: 1, timestamp: "01/10/2018", data: { amount: 4} };
const testBlock = new Block(testObject);

test('constructor()', t => {
  t.is(testObject.index, testBlock.index);
  t.is(testObject.timestamp, testBlock.timestamp);
  t.is(testObject.data, testBlock.data);
});

test('calculateHash()', t => {
  const hash = testBlock.calculateHash();
  const expectedHash = '64e8966a97ecdfc95914e0e8e74b4fc6eb7be4d14227c1556ad2ce8f6833325c44aae9c8455fe0a73cfbaa4141fff29bd331504747046a0930c77c2df5a7c3c1';
  t.is(hash, expectedHash);
});
