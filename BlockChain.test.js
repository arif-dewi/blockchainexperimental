import BlockChain from './BlockChain';
import Block from './Block';
import test from 'ava';

const TestBlockChain = new BlockChain();

test('constructor should create Genesis block', t => {
  t.is(TestBlockChain.chain[0].data, 'Genesis Block');
});

test('createGenesisBlock() should return Genesis block', t => {
  t.is(BlockChain.createGenesisBlock().data, 'Genesis Block');
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
