const Logger = require('./Logger');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const EC_ENCODING = 'hex';


const key = ec.genKeyPair();
const publicKey = key.getPublic(EC_ENCODING);
const privateKey = key.getPrivate(EC_ENCODING);

Logger.info(`Public key: ${publicKey}`);
Logger.info(`Private key: ${privateKey}`);
