class Transaction {
  /**
   * Constructor
   * @param fromAddress
   * @param toAddress
   * @param amount
   */
  constructor({fromAddress, toAddress, amount}) {
    // TODO: tests
    this.fromAddress = fromAddress;
    this.toAddres = toAddress;
    this.amount = amount;
  }

}

module.exports = Transaction;
