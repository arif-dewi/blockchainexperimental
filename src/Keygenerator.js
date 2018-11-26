const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const EC_ENCODING = 'hex';

const key = ec.genKeyPair();
const publicKey = key.getPublic(EC_ENCODING);
const privateKey = key.getPrivate(EC_ENCODING);

console.log();
console.log('Public key:', publicKey);
console.log('Private key:', privateKey);
