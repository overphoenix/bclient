import * as assert from "bsert";
import * as bcurl from "bcurl";
import { EventEmitter } from "node:events";
import { Options } from "./types";

/**
 * Wallet Client
 * @alias module:client.WalletClient
 * @extends {bcurl.Client}
 */
export class WalletClient extends bcurl.Client {
  wallets: Map<string, Wallet> = new Map();

  /**
   * Create a wallet client.
   * @param {Object?} options
   */
  constructor(options: Options) {
    super(options);
  }

  /**
   * Open the client.
   * @private
   * @returns {Promise}
   */
  init() {
    super.bind("tx", (id: string, details: any) => {
      this.dispatch(id, "tx", details);
    });

    super.bind("confirmed", (id: string, details: any) => {
      this.dispatch(id, "confirmed", details);
    });

    super.bind("unconfirmed", (id: string, details: any) => {
      this.dispatch(id, "unconfirmed", details);
    });

    super.bind("conflict", (id: string, details: any) => {
      this.dispatch(id, "conflict", details);
    });

    super.bind("updated", (id: string, details: any) => {
      this.dispatch(id, "updated", details);
    });

    super.bind("address", (id: string, receive: any) => {
      this.dispatch(id, "address", receive);
    });

    super.bind("balance", (id: string, balance: any) => {
      this.dispatch(id, "balance", balance);
    });
  }

  /**
   * Dispatch event.
   * @param {Number} id
   * @param {String} event
   * @param {...Object} args
   * @private
   */
  dispatch(id: string, event: string, ...args: Array<any>) {
    const wallet = this.wallets.get(id);

    if (wallet) wallet.emit(event, ...args);
  }

  /**
   * Open the client.
   * @returns {Promise}
   */
  async open() {
    await super.open();
    this.init();
  }

  /**
   * Close the client.
   * @returns {Promise}
   */
  async close() {
    await super.close();
    this.wallets = new Map();
  }

  /**
   * Auth with server.
   * @returns {Promise}
   */
  async auth() {
    await super.call("auth", this.password);
  }

  /**
   * Make an RPC call.
   * @returns {Promise}
   */
  execute(name: string, params: any) {
    return super.execute("/", name, params);
  }

  /**
   * Create a wallet object.
   * @param {Number} id
   * @param {String} token
   */
  wallet(id: string, token?: string) {
    return new Wallet(this, id, token);
  }

  /**
   * Join a wallet.
   * @param {String} token
   */
  all(token?: string) {
    return super.call("join", "*", token);
  }

  /**
   * Leave a wallet.
   */
  none() {
    return super.call("leave", "*");
  }

  /**
   * Join a wallet.
   * @param {Number} id
   * @param {String} token
   */
  join(id: string, token?: string) {
    return super.call("join", id, token);
  }

  /**
   * Leave a wallet.
   * @param {Number} id
   */
  leave(id: string) {
    return super.call("leave", id);
  }

  /**
   * Rescan the chain.
   * @param {Number} height
   * @returns {Promise}
   */
  rescan(height: number) {
    return super.post("/rescan", { height });
  }

  /**
   * Resend pending transactions.
   * @returns {Promise}
   */
  resend() {
    return super.post("/resend");
  }

  /**
   * Backup the walletdb.
   * @param {String} path
   * @returns {Promise}
   */
  backup(path: string) {
    return super.post("/backup", { path });
  }

  /**
   * Get list of all wallet IDs.
   * @returns {Promise}
   */
  getWallets() {
    return super.get("/wallet");
  }

  /**
   * Create a wallet.
   * @param {Number} id
   * @param {Object} options
   * @returns {Promise}
   */
  createWallet(id: string, options: any) {
    return super.put(`/wallet/${id}`, options);
  }

  /**
   * Get wallet transaction history.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  getHistory(id: string, account: string) {
    return super.get(`/wallet/${id}/tx/history`, { account });
  }

  /**
   * Get wallet coins.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  getCoins(id: string, account: string) {
    return super.get(`/wallet/${id}/coin`, { account });
  }

  /**
   * Get all unconfirmed transactions.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  getPending(id: string, account: string) {
    return super.get(`/wallet/${id}/tx/unconfirmed`, { account });
  }

  /**
   * Calculate wallet balance.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  getBalance(id: string, account: string) {
    return super.get(`/wallet/${id}/balance`, { account });
  }

  /**
   * Get last N wallet transactions.
   * @param {Number} id
   * @param {String} account
   * @param {Number} limit - Max number of transactions.
   * @returns {Promise}
   */
  getLast(id: string, account: string, limit: number) {
    return super.get(`/wallet/${id}/tx/last`, { account, limit });
  }

  /**
   * Get wallet transactions by timestamp range.
   * @param {Number} id
   * @param {String} account
   * @param {Object} options
   * @param {Number} options.start - Start time.
   * @param {Number} options.end - End time.
   * @param {Number?} options.limit - Max number of records.
   * @param {Boolean?} options.reverse - Reverse order.
   * @returns {Promise}
   */
  getRange(
    id: string,
    account: string,
    options: { start: number; end: number; limit?: number; reverse?: boolean },
  ) {
    return super.get(`/wallet/${id}/tx/range`, {
      account: account,
      start: options.start,
      end: options.end,
      limit: options.limit,
      reverse: options.reverse,
    });
  }

  /**
   * Get transaction (only possible if the transaction
   * is available in the wallet history).
   * @param {Number} id
   * @param {Hash} hash
   * @returns {Promise}
   */
  getTX(id: string, hash: string) {
    return super.get(`/wallet/${id}/tx/${hash}`);
  }

  /**
   * Get wallet blocks.
   * @param {Number} id
   * @returns {Promise}
   */
  getBlocks(id: string) {
    return super.get(`/wallet/${id}/block`);
  }

  /**
   * Get wallet block.
   * @param {Number} id
   * @param {Number} height
   * @returns {Promise}
   */
  getBlock(id: string, height: number) {
    return super.get(`/wallet/${id}/block/${height}`);
  }

  /**
   * Get unspent coin (only possible if the transaction
   * is available in the wallet history).
   * @param {Number} id
   * @param {Hash} hash
   * @param {Number} index
   * @returns {Promise}
   */
  getCoin(id: string, hash: string, index: number) {
    return super.get(`/wallet/${id}/coin/${hash}/${index}`);
  }

  /**
   * @param {Number} id
   * @param {String} account
   * @param {Number} age - Age delta.
   * @returns {Promise}
   */
  zap(id: string, account: string, age: number) {
    return super.post(`/wallet/${id}/zap`, { account, age });
  }

  /**
   * @param {Number} id
   * @param {Hash} hash
   * @returns {Promise}
   */
  abandon(id: string, hash: string) {
    return super.del(`/wallet/${id}/tx/${hash}`);
  }

  /**
   * Create a transaction, fill.
   * @param {Number} id
   * @param {Object} options
   * @returns {Promise}
   */
  createTX(id: string, options: any) {
    return super.post(`/wallet/${id}/create`, options);
  }

  /**
   * Create a transaction, fill, sign, and broadcast.
   * @param {Number} id
   * @param {Object} options
   * @param {String} options.address
   * @param {Amount} options.value
   * @returns {Promise}
   */
  send(id: string, options: any) {
    return super.post(`/wallet/${id}/send`, options);
  }

  /**
   * Sign a transaction.
   * @param {Number} id
   * @param {Object} options
   * @returns {Promise}
   */
  sign(id: string, options: any) {
    return super.post(`/wallet/${id}/sign`, options);
  }

  /**
   * Get the raw wallet JSON.
   * @param {Number} id
   * @returns {Promise}
   */
  getInfo(id: string) {
    return super.get(`/wallet/${id}`);
  }

  /**
   * Get wallet accounts.
   * @param {Number} id
   * @returns {Promise} - Returns Array.
   */
  getAccounts(id: string) {
    return super.get(`/wallet/${id}/account`);
  }

  /**
   * Get wallet master key.
   * @param {Number} id
   * @returns {Promise}
   */
  getMaster(id: string) {
    return super.get(`/wallet/${id}/master`);
  }

  /**
   * Get wallet account.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  getAccount(id: string, account: string) {
    return super.get(`/wallet/${id}/account/${account}`);
  }

  /**
   * Create account.
   * @param {Number} id
   * @param {String} name
   * @param {Object} options
   * @returns {Promise}
   */
  createAccount(id: string, name: string, options: any) {
    return super.put(`/wallet/${id}/account/${name}`, options);
  }

  /**
   * Create address.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  createAddress(id: string, account: string) {
    return super.post(`/wallet/${id}/address`, { account });
  }

  /**
   * Create change address.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  createChange(id: string, account: string) {
    return super.post(`/wallet/${id}/change`, { account });
  }

  /**
   * Create nested address.
   * @param {Number} id
   * @param {String} account
   * @returns {Promise}
   */
  createNested(id: string, account: string) {
    return super.post(`/wallet/${id}/nested`, { account });
  }

  /**
   * Change or set master key`s passphrase.
   * @param {Number} id
   * @param {String|Buffer} passphrase
   * @param {(String|Buffer)?} old
   * @returns {Promise}
   */
  setPassphrase(
    id: string,
    passphrase: string | Buffer,
    old?: string | Buffer,
  ) {
    return super.post(`/wallet/${id}/passphrase`, { passphrase, old });
  }

  /**
   * Generate a new token.
   * @param {Number} id
   * @param {(String|Buffer)?} passphrase
   * @returns {Promise}
   */
  retoken(id: string, passphrase?: string | Buffer) {
    return super.post(`/wallet/${id}/retoken`, {
      passphrase,
    });
  }

  /**
   * Import private key.
   * @param {Number} id
   * @param {String} account
   * @param {String} privateKey
   * @param {String} passphrase
   * @returns {Promise}
   */
  importPrivate(
    id: string,
    account: string,
    privateKey: string,
    passphrase?: string,
  ) {
    return super.post(`/wallet/${id}/import`, {
      account,
      privateKey,
      passphrase,
    });
  }

  /**
   * Import public key.
   * @param {Number} id
   * @param {Number|String} account
   * @param {String} publicKey
   * @returns {Promise}
   */
  importPublic(id: string, account: number | string, publicKey: string) {
    return super.post(`/wallet/${id}/import`, {
      account,
      publicKey,
    });
  }

  /**
   * Import address.
   * @param {Number} id
   * @param {String} account
   * @param {String} address
   * @returns {Promise}
   */
  importAddress(id: string, account: string, address: string) {
    return super.post(`/wallet/${id}/import`, { account, address });
  }

  /**
   * Lock a coin.
   * @param {Number} id
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */
  lockCoin(id: string, hash: string, index: number) {
    return super.put(`/wallet/${id}/locked/${hash}/${index}`);
  }

  /**
   * Unlock a coin.
   * @param {Number} id
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */
  unlockCoin(id: string, hash: string, index: number) {
    return super.del(`/wallet/${id}/locked/${hash}/${index}`);
  }

  /**
   * Get locked coins.
   * @param {Number} id
   * @returns {Promise}
   */
  getLocked(id: string) {
    return super.get(`/wallet/${id}/locked`);
  }

  /**
   * Lock wallet.
   * @param {Number} id
   * @returns {Promise}
   */
  lock(id: string) {
    return super.post(`/wallet/${id}/lock`);
  }

  /**
   * Unlock wallet.
   * @param {Number} id
   * @param {String} passphrase
   * @param {Number} timeout
   * @returns {Promise}
   */
  unlock(id: string, passphrase: string, timeout: number) {
    return super.post(`/wallet/${id}/unlock`, { passphrase, timeout });
  }

  /**
   * Get wallet key.
   * @param {Number} id
   * @param {String} address
   * @returns {Promise}
   */
  getKey(id: string, address: string) {
    return super.get(`/wallet/${id}/key/${address}`);
  }

  /**
   * Get wallet key WIF dump.
   * @param {Number} id
   * @param {String} address
   * @param {String?} passphrase
   * @returns {Promise}
   */
  getWIF(id: string, address: string, passphrase?: string) {
    return super.get(`/wallet/${id}/wif/${address}`, { passphrase });
  }

  /**
   * Add a public account key to the wallet for multisig.
   * @param {Number} id
   * @param {String} account
   * @param {String} accountKey - Account (bip44) key (base58).
   * @returns {Promise}
   */
  addSharedKey(id: string, account: string, accountKey: string) {
    return super.put(`/wallet/${id}/shared-key`, { account, accountKey });
  }

  /**
   * Remove a public account key to the wallet for multisig.
   * @param {Number} id
   * @param {String} account
   * @param {String} accountKey - Account (bip44) key (base58).
   * @returns {Promise}
   */
  removeSharedKey(id: string, account: string, accountKey: string) {
    return super.del(`/wallet/${id}/shared-key`, { account, accountKey });
  }

  /**
   * Resend wallet transactions.
   * @param {Number} id
   * @returns {Promise}
   */
  resendWallet(id: string) {
    return super.post(`/wallet/${id}/resend`);
  }
}

/**
 * Wallet Instance
 * @extends {EventEmitter}
 */

export class Wallet extends EventEmitter {
  client: WalletClient;
  id: string;
  token?: string;

  /**
   * Create a wallet client.
   * @param {WalletClient} parent
   * @param {Number} id
   * @param {String} token
   */
  constructor(client: WalletClient, id: string, token?: string) {
    super();
    this.client = client.clone();
    this.client.token = token;
    this.id = id;
    this.token = token;
  }

  /**
   * Open wallet.
   * @returns {Promise}
   */
  async open() {
    await this.client.join(this.id, this.token);
    this.client.wallets.set(this.id, this);
  }

  /**
   * Close wallet.
   * @returns {Promise}
   */
  async close() {
    await this.client.leave(this.id);
    this.client.wallets.delete(this.id);
  }

  /**
   * Get wallet transaction history.
   * @param {String} account
   * @returns {Promise}
   */
  getHistory(account: string) {
    return this.client.getHistory(this.id, account);
  }

  /**
   * Get wallet coins.
   * @param {String} account
   * @returns {Promise}
   */
  getCoins(account: string) {
    return this.client.getCoins(this.id, account);
  }

  /**
   * Get all unconfirmed transactions.
   * @param {String} account
   * @returns {Promise}
   */
  getPending(account: string) {
    return this.client.getPending(this.id, account);
  }

  /**
   * Calculate wallet balance.
   * @param {String} account
   * @returns {Promise}
   */
  getBalance(account: string) {
    return this.client.getBalance(this.id, account);
  }

  /**
   * Get last N wallet transactions.
   * @param {String} account
   * @param {Number} limit - Max number of transactions.
   * @returns {Promise}
   */
  getLast(account: string, limit: number) {
    return this.client.getLast(this.id, account, limit);
  }

  /**
   * Get wallet transactions by timestamp range.
   * @param {String} account
   * @param {Object} options
   * @param {Number} options.start - Start time.
   * @param {Number} options.end - End time.
   * @param {Number?} options.limit - Max number of records.
   * @param {Boolean?} options.reverse - Reverse order.
   * @returns {Promise}
   */
  getRange(
    account: string,
    options: { start: number; end: number; limit?: number; reserved?: boolean },
  ) {
    return this.client.getRange(this.id, account, options);
  }

  /**
   * Get transaction (only possible if the transaction
   * is available in the wallet history).
   * @param {Hash} hash
   * @returns {Promise}
   */
  getTX(hash: string) {
    return this.client.getTX(this.id, hash);
  }

  /**
   * Get wallet blocks.
   * @returns {Promise}
   */
  getBlocks() {
    return this.client.getBlocks(this.id);
  }

  /**
   * Get wallet block.
   * @param {Number} height
   * @returns {Promise}
   */
  getBlock(height: number) {
    return this.client.getBlock(this.id, height);
  }

  /**
   * Get unspent coin (only possible if the transaction
   * is available in the wallet history).
   * @param {Hash} hash
   * @param {Number} index
   * @returns {Promise}
   */
  getCoin(hash: string, index: number) {
    return this.client.getCoin(this.id, hash, index);
  }

  /**
   * @param {String} account
   * @param {Number} age - Age delta.
   * @returns {Promise}
   */
  zap(account: string, age: number) {
    return this.client.zap(this.id, account, age);
  }

  /**
   * Used to remove a pending transaction from the wallet.
   * That is likely the case if it has a policy or low fee
   * that prevents it from proper network propagation.
   * @param {Hash} hash
   * @returns {Promise}
   */
  abandon(hash: string) {
    return this.client.abandon(this.id, hash);
  }

  /**
   * Create a transaction, fill.
   * @param {Object} options
   * @returns {Promise}
   */
  createTX(options: any) {
    return this.client.createTX(this.id, options);
  }

  /**
   * Create a transaction, fill, sign, and broadcast.
   * @param {Object} options
   * @param {String} options.address
   * @param {Amount} options.value
   * @returns {Promise}
   */
  send(options: any) {
    return this.client.send(this.id, options);
  }

  /**
   * Sign a transaction.
   * @param {Object} options
   * @returns {Promise}
   */
  sign(options: any) {
    return this.client.sign(this.id, options);
  }

  /**
   * Get the raw wallet JSON.
   * @returns {Promise}
   */
  getInfo() {
    return this.client.getInfo(this.id);
  }

  /**
   * Get wallet accounts.
   * @returns {Promise} - Returns Array.
   */
  getAccounts() {
    return this.client.getAccounts(this.id);
  }

  /**
   * Get wallet master key.
   * @returns {Promise}
   */
  getMaster() {
    return this.client.getMaster(this.id);
  }

  /**
   * Get wallet account.
   * @param {String} account
   * @returns {Promise}
   */
  getAccount(account: string) {
    return this.client.getAccount(this.id, account);
  }

  /**
   * Create account.
   * @param {String} name
   * @param {Object} options
   * @returns {Promise}
   */
  createAccount(name: string, options: any) {
    return this.client.createAccount(this.id, name, options);
  }

  /**
   * Create address.
   * @param {String} account
   * @returns {Promise}
   */
  createAddress(account: string) {
    return this.client.createAddress(this.id, account);
  }

  /**
   * Create change address.
   * @param {String} account
   * @returns {Promise}
   */
  createChange(account: string) {
    return this.client.createChange(this.id, account);
  }

  /**
   * Create nested address.
   * @param {String} account
   * @returns {Promise}
   */
  createNested(account: string) {
    return this.client.createNested(this.id, account);
  }

  /**
   * Change or set master key`s passphrase.
   * @param {String|Buffer} passphrase
   * @param {(String|Buffer)?} old
   * @returns {Promise}
   */
  setPassphrase(passphrase: string | Buffer, old?: string | Buffer) {
    return this.client.setPassphrase(this.id, passphrase, old);
  }

  /**
   * Generate a new token.
   * @param {(String|Buffer)?} passphrase
   * @returns {Promise}
   */
  async retoken(passphrase: string | Buffer) {
    const result = await this.client.retoken(this.id, passphrase);

    assert(result);
    assert(typeof result.token === "string");

    this.token = result.token;

    return result;
  }

  /**
   * Import private key.
   * @param {Number|String} account
   * @param {String} privateKey
   * @param {String} passphrase
   * @returns {Promise}
   */
  importPrivate(account: string, privateKey: string, passphrase?: string) {
    return this.client.importPrivate(this.id, account, privateKey, passphrase);
  }

  /**
   * Import public key.
   * @param {Number|String} account
   * @param {String} publicKey
   * @returns {Promise}
   */
  importPublic(account: string, publicKey: string) {
    return this.client.importPublic(this.id, account, publicKey);
  }

  /**
   * Import address.
   * @param {Number|String} account
   * @param {String} address
   * @returns {Promise}
   */
  importAddress(account: string, address: string) {
    return this.client.importAddress(this.id, account, address);
  }

  /**
   * Lock a coin.
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */
  lockCoin(hash: string, index: number) {
    return this.client.lockCoin(this.id, hash, index);
  }

  /**
   * Unlock a coin.
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */
  unlockCoin(hash: string, index: number) {
    return this.client.unlockCoin(this.id, hash, index);
  }

  /**
   * Get locked coins.
   * @returns {Promise}
   */
  getLocked() {
    return this.client.getLocked(this.id);
  }

  /**
   * Lock wallet.
   * @returns {Promise}
   */
  lock() {
    return this.client.lock(this.id);
  }

  /**
   * Unlock wallet.
   * @param {String} passphrase
   * @param {Number} timeout
   * @returns {Promise}
   */
  unlock(passphrase: string, timeout: number) {
    return this.client.unlock(this.id, passphrase, timeout);
  }

  /**
   * Get wallet key.
   * @param {String} address
   * @returns {Promise}
   */
  getKey(address: string) {
    return this.client.getKey(this.id, address);
  }

  /**
   * Get wallet key WIF dump.
   * @param {String} address
   * @param {String?} passphrase
   * @returns {Promise}
   */
  getWIF(address: string, passphrase?: string) {
    return this.client.getWIF(this.id, address, passphrase);
  }

  /**
   * Add a public account key to the wallet for multisig.
   * @param {String} account
   * @param {String} accountKey - Account (bip44) key (base58).
   * @returns {Promise}
   */
  addSharedKey(account: string, accountKey: string) {
    return this.client.addSharedKey(this.id, account, accountKey);
  }

  /**
   * Remove a public account key to the wallet for multisig.
   * @param {String} account
   * @param {String} accountKey - Account (bip44) key (base58).
   * @returns {Promise}
   */
  removeSharedKey(account: string, accountKey: string) {
    return this.client.removeSharedKey(this.id, account, accountKey);
  }

  /**
   * Resend wallet transactions.
   * @returns {Promise}
   */
  resend() {
    return this.client.resendWallet(this.id);
  }
}
