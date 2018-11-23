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
  const expectedHash = '077bd1c377348d93c7a227df255746575f7869f1545770e67bf993d0299f4a58d4ab025553d2238e86483588614c7fa8fb1d9be374710e71026ab1b095049a49';
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
