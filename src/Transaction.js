const SHA3 = require("crypto-js/sha3");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SIGN_ENCODING = 'base64';
const EC_ENCODING = 'hex';

class Transaction {
  /**
   * Constructor
   * @param fromAddress
   * @param toAddress
   * @param amount
   */
  constructor({fromAddress, toAddress, amount}) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.signature = null;
  }
  /**
   * Calculate hash
   * @returns {*}
   */
  calculateHash() {
    return SHA3(`${this.fromAddress}${this.toAddress}${this.amount}`).toString();
  }
  /**
   * Sign transaction
   * @param key
   */
  signTransaction(key) {
    if (!key || typeof key.getPublic !== 'function') {
      throw new Error('Key should be specified!');
    }
    else if (key.getPublic(EC_ENCODING) !== this.fromAddress) {
      throw new Error("You can't sign transactions for other wallets!");
    }

    const hash = this.calculateHash();
    const signature = key.sign(hash, SIGN_ENCODING);
    this.signature = signature.toDER(EC_ENCODING);
  }
  /**
   * Check whether the sing off succeed
   */
  isValid() {
    if (this.fromAddress == null) return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction!');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, EC_ENCODING);
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports = Transaction;
