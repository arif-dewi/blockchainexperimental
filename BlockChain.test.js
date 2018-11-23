import BlockChain from './BlockChain';
import Block from './Block';
import test from 'ava';

const TestBlockChain = new BlockChain();

const getBlockToRestore = index => {
  const blockToRestore = TestBlockChain.chain[index];
  const newBlockToRestore = new Block({
    index: blockToRestore.index,
    timestamp: blockToRestore.timestamp,
    previousHash: blockToRestore.previousHash,
    data: blockToRestore.data
  });

  return newBlockToRestore;
};

test('constructor should create Genesis block', t => {
  t.is(TestBlockChain.chain[0].data, 'Genesis Block');
});

test('createGenesisBlock() should return Genesis block', t => {
  t.is(TestBlockChain.createGenesisBlock().data, 'Genesis Block');
  // Clear up test chain
  TestBlockChain.chain.shift();
});

test('addBlock() should add new block to the chain', t => {
  const newBlock = new Block({index: 1, timestamp: "01/10/2018", data: { amount: 4} });
  TestBlockChain.addBlock(newBlock);

  t.is(TestBlockChain.chain[1].index, 1);
});

test('addBlock() sholud not add anything except Block instances', t => {
  TestBlockChain.addBlock({});
  t.is(TestBlockChain.chain.length, 2);
});

test('getLatestBlock() should return the latest block', t => {
  t.is(TestBlockChain.getLatestBlock().index, 1);
});

test('isChainValid() should return true if this is the case', t => {
  t.true(TestBlockChain.isChainValid());
});

test('isChainValid() should return false if chain has been hacked', t => {
  const index = 1;
  const blockToRestore = getBlockToRestore(index);

  TestBlockChain.chain[index].data = { amount: 100};
  TestBlockChain.chain[index].calculateHash();

  t.false(TestBlockChain.isChainValid());

  TestBlockChain.chain[index] = blockToRestore;
});

test('isChainValid() should return false if hash has been hacked', t => {
  const index = 0;
  const blockToRestore = getBlockToRestore(index);

  TestBlockChain.chain[0].hash = '123';
  const result = TestBlockChain.isChainValid();

  t.false(result);

  TestBlockChain.chain[index] = blockToRestore;
});
