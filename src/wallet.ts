import * as assert from "bsert";
import * as bcurl from "bcurl";
import EventEmitter from "node:events";
import { ClientOptions } from "./types";

/**
 * Wallet Client
 * @extends {bcurl.Client}
 */
export default class WalletClient extends bcurl.Client {
  wallets: Map<string, any>;
  /**
   * Create a wallet client.
   * @param {Object?} options
   */

  constructor(options: ClientOptions) {
    super(options);
    this.wallets = new Map();
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
   * @private
   */

  dispatch(id: string, event: any, ...args: any) {
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

  execute(name: any, params: any) {
    return super.execute("/", name, params);
  }

  /**
   * Create a wallet object.
   */

  wallet(id: string, token: any) {
    return new Wallet(this, id, token);
  }

  /**
   * Join a wallet.
   */

  all(token: any) {
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
   */

  join(id: string, token: any) {
    return super.call("join", id, token);
  }

  /**
   * Leave a wallet.
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
   * @param {Object} options
   * @returns {Promise}
   */

  createWallet(id: string, options: any) {
    return super.put(`/wallet/${id}`, options);
  }

  /**
   * Get wallet transaction history.
   * @param {String} account
   * @returns {Promise}
   */

  getHistory(id: string, account: any) {
    return super.get(`/wallet/${id}/tx/history`, { account });
  }

  /**
   * Get wallet coins.
   * @param {String} account
   * @returns {Promise}
   */

  getCoins(id: string, account: any) {
    return super.get(`/wallet/${id}/coin`, { account });
  }

  /**
   * Get all unconfirmed transactions.
   * @param {String} account
   * @returns {Promise}
   */

  getPending(id: string, account: any) {
    return super.get(`/wallet/${id}/tx/unconfirmed`, { account });
  }

  /**
   * Calculate wallet balance.
   * @param {String} account
   * @returns {Promise}
   */

  getBalance(id: string, account: any) {
    return super.get(`/wallet/${id}/balance`, { account });
  }

  /**
   * Get last N wallet transactions.
   * @param {String} account
   * @param {Number} limit - Max number of transactions.
   * @returns {Promise}
   */

  getLast(id: string, account: any, limit: any) {
    return super.get(`/wallet/${id}/tx/last`, { account, limit });
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

  getRange(id: string, account: any, options: any) {
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
   * @param {Hash} hash
   * @returns {Promise}
   */

  getTX(id: string, hash: string) {
    return super.get(`/wallet/${id}/tx/${hash}`);
  }

  /**
   * Get wallet blocks.
   * @param {Number} height
   * @returns {Promise}
   */

  getBlocks(id: string) {
    return super.get(`/wallet/${id}/block`);
  }

  /**
   * Get wallet block.
   * @param {Number} height
   * @returns {Promise}
   */

  getBlock(id: string, height: string | number) {
    return super.get(`/wallet/${id}/block/${height}`);
  }

  /**
   * Get unspent coin (only possible if the transaction
   * is available in the wallet history).
   * @param {Hash} hash
   * @param {Number} index
   * @returns {Promise}
   */

  getCoin(id: string, hash: string, index: any) {
    return super.get(`/wallet/${id}/coin/${hash}/${index}`);
  }

  /**
   * @param {Number} now - Current time.
   * @param {Number} age - Age delta.
   * @returns {Promise}
   */

  zap(id: string, account: any, age: any) {
    return super.post(`/wallet/${id}/zap`, { account, age });
  }

  /**
   * Create a transaction, fill.
   * @param {Object} options
   * @returns {Promise}
   */

  createTX(id: string, options: any) {
    return super.post(`/wallet/${id}/create`, options);
  }

  /**
   * Create a transaction, fill, sign, and broadcast.
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
   * @param {Object} options
   * @returns {Promise}
   */

  sign(id: string, options: any) {
    return super.post(`/wallet/${id}/sign`, options);
  }

  /**
   * Get the raw wallet JSON.
   * @returns {Promise}
   */

  getInfo(id: string) {
    return super.get(`/wallet/${id}`);
  }

  /**
   * Get wallet accounts.
   * @returns {Promise} - Returns Array.
   */

  getAccounts(id: string) {
    return super.get(`/wallet/${id}/account`);
  }

  /**
   * Get wallet master key.
   * @returns {Promise}
   */

  getMaster(id: string) {
    return super.get(`/wallet/${id}/master`);
  }

  /**
   * Get wallet account.
   * @param {String} account
   * @returns {Promise}
   */

  getAccount(id: string, account: string) {
    return super.get(`/wallet/${id}/account/${account}`);
  }

  /**
   * Create account.
   * @param {String} name
   * @param {Object} options
   * @returns {Promise}
   */

  createAccount(id: string, name: string, options: any) {
    return super.put(`/wallet/${id}/account/${name}`, options);
  }

  /**
   * Create address.
   * @param {Object} options
   * @returns {Promise}
   */

  createAddress(id: string, account: any) {
    return super.post(`/wallet/${id}/address`, { account });
  }

  /**
   * Create change address.
   * @param {Object} options
   * @returns {Promise}
   */

  createChange(id: string, account: any) {
    return super.post(`/wallet/${id}/change`, { account });
  }

  /**
   * Create nested address.
   * @param {Object} options
   * @returns {Promise}
   */

  createNested(id: string, account: any) {
    return super.post(`/wallet/${id}/nested`, { account });
  }

  /**
   * Change or set master key`s passphrase.
   * @param {String|Buffer} passphrase
   * @param {(String|Buffer)?} old
   * @returns {Promise}
   */

  setPassphrase(id: string, passphrase: any, old: any) {
    return super.post(`/wallet/${id}/passphrase`, { passphrase, old });
  }

  /**
   * Generate a new token.
   * @param {(String|Buffer)?} passphrase
   * @returns {Promise}
   */

  retoken(id: string, passphrase: any) {
    return super.post(`/wallet/${id}/retoken`, {
      passphrase,
    });
  }

  /**
   * Import private key.
   * @param {Number|String} account
   * @param {String} key
   * @returns {Promise}
   */

  importPrivate(id: string, account: any, privateKey: any, passphrase: any) {
    return super.post(`/wallet/${id}/import`, {
      account,
      privateKey,
      passphrase,
    });
  }

  /**
   * Import public key.
   * @param {Number|String} account
   * @param {String} key
   * @returns {Promise}
   */

  importPublic(id: string, account: any, publicKey: any) {
    return super.post(`/wallet/${id}/import`, {
      account,
      publicKey,
    });
  }

  /**
   * Import address.
   * @param {Number|String} account
   * @param {String} address
   * @returns {Promise}
   */

  importAddress(id: string, account: any, address: any) {
    return super.post(`/wallet/${id}/import`, { account, address });
  }

  /**
   * Lock a coin.
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */

  lockCoin(id: string, hash: string, index: any) {
    return super.put(`/wallet/${id}/locked/${hash}/${index}`);
  }

  /**
   * Unlock a coin.
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */

  unlockCoin(id: string, hash: string, index: any) {
    return super.del(`/wallet/${id}/locked/${hash}/${index}`);
  }

  /**
   * Get locked coins.
   * @returns {Promise}
   */

  getLocked(id: string) {
    return super.get(`/wallet/${id}/locked`);
  }

  /**
   * Lock wallet.
   * @returns {Promise}
   */

  lock(id: string) {
    return super.post(`/wallet/${id}/lock`);
  }

  /**
   * Unlock wallet.
   * @param {String} passphrase
   * @param {Number} timeout
   * @returns {Promise}
   */

  unlock(id: string, passphrase: any, timeout: any) {
    return super.post(`/wallet/${id}/unlock`, { passphrase, timeout });
  }

  /**
   * Get wallet key.
   * @param {String} address
   * @returns {Promise}
   */

  getKey(id: string, address: any) {
    return super.get(`/wallet/${id}/key/${address}`);
  }

  /**
   * Get wallet key WIF dump.
   * @param {String} address
   * @param {String?} passphrase
   * @returns {Promise}
   */

  getWIF(id: string, address: any, passphrase: any) {
    return super.get(`/wallet/${id}/wif/${address}`, { passphrase });
  }

  /**
   * Add a public account key to the wallet for multisig.
   * @param {String} account
   * @param {String} key - Account (bip44) key (base58).
   * @returns {Promise}
   */

  addSharedKey(id: string, account: any, accountKey: any) {
    return super.put(`/wallet/${id}/shared-key`, { account, accountKey });
  }

  /**
   * Remove a public account key to the wallet for multisig.
   * @param {String} account
   * @param {String} key - Account (bip44) key (base58).
   * @returns {Promise}
   */

  removeSharedKey(id: string, account: any, accountKey: any) {
    return SUPER.del(`/wallet/${id}/shared-key`, { account, accountKey });
  }

  /**
   * Resend wallet transactions.
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

class Wallet extends EventEmitter {
  parent: WalletClient | Wallet;
  client: WalletClient;
  id: string;
  token: string | null;

  /**
   * Create a wallet client.
   * @param {Object?} options
   */
  constructor(parent: WalletClient | Wallet, id: string, token: string | null) {
    super();
    this.parent = parent;
    this.client = parent.clone();
    this.client.token = token;
    this.id = id;
    this.token = token;
  }

  /**
   * Open wallet.
   * @returns {Promise}
   */

  async open() {
    await this.parent.join(this.id, this.token);
    this.parent.wallets.set(this.id, this);
  }

  /**
   * Close wallet.
   * @returns {Promise}
   */

  async close() {
    await this.parent.leave(this.id);
    this.parent.wallets.delete(this.id);
  }

  /**
   * Get wallet transaction history.
   * @param {String} account
   * @returns {Promise}
   */

  getHistory(account: any) {
    return this.client.getHistory(this.id, account);
  }

  /**
   * Get wallet coins.
   * @param {String} account
   * @returns {Promise}
   */

  getCoins(account: any) {
    return this.client.getCoins(this.id, account);
  }

  /**
   * Get all unconfirmed transactions.
   * @param {String} account
   * @returns {Promise}
   */

  getPending(account: any) {
    return this.client.getPending(this.id, account);
  }

  /**
   * Calculate wallet balance.
   * @param {String} account
   * @returns {Promise}
   */

  getBalance(account: any) {
    return this.client.getBalance(this.id, account);
  }

  /**
   * Get last N wallet transactions.
   * @param {String} account
   * @param {Number} limit - Max number of transactions.
   * @returns {Promise}
   */

  getLast(account: any, limit: any) {
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

  getRange(account: any, options: any) {
    return this.client.getRange(this.id, account, options);
  }

  /**
   * Get transaction (only possible if the transaction
   * is available in the wallet history).
   * @param {Hash} hash
   * @returns {Promise}
   */

  getTX(hash: any) {
    return this.client.getTX(this.id, hash);
  }

  /**
   * Get wallet blocks.
   * @param {Number} height
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

  getBlock(height: any) {
    return this.client.getBlock(this.id, height);
  }

  /**
   * Get unspent coin (only possible if the transaction
   * is available in the wallet history).
   * @param {Hash} hash
   * @param {Number} index
   * @returns {Promise}
   */

  getCoin(hash: any, index: any) {
    return this.client.getCoin(this.id, hash, index);
  }

  /**
   * @param {Number} now - Current time.
   * @param {Number} age - Age delta.
   * @returns {Promise}
   */

  zap(account: any, age: any) {
    return this.client.zap(this.id, account, age);
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

  getAccount(account: any) {
    return this.client.getAccount(this.id, account);
  }

  /**
   * Create account.
   * @param {String} name
   * @param {Object} options
   * @returns {Promise}
   */

  createAccount(name: any, options: any) {
    return this.client.createAccount(this.id, name, options);
  }

  /**
   * Create address.
   * @param {Object} options
   * @returns {Promise}
   */

  createAddress(account: any) {
    return this.client.createAddress(this.id, account);
  }

  /**
   * Create change address.
   * @param {Object} options
   * @returns {Promise}
   */

  createChange(account: any) {
    return this.client.createChange(this.id, account);
  }

  /**
   * Create nested address.
   * @param {Object} options
   * @returns {Promise}
   */

  createNested(account: any) {
    return this.client.createNested(this.id, account);
  }

  /**
   * Change or set master key`s passphrase.
   * @param {String|Buffer} passphrase
   * @param {(String|Buffer)?} old
   * @returns {Promise}
   */

  setPassphrase(passphrase: any, old: any) {
    return this.client.setPassphrase(this.id, passphrase, old);
  }

  /**
   * Generate a new token.
   * @param {(String|Buffer)?} passphrase
   * @returns {Promise}
   */

  async retoken(passphrase: any) {
    const result = await this.client.retoken(this.id, passphrase);

    assert(result);
    assert(typeof result.token === "string");

    this.token = result.token;

    return result;
  }

  /**
   * Import private key.
   * @param {Number|String} account
   * @param {String} key
   * @returns {Promise}
   */

  importPrivate(account: any, privateKey: any, passphrase: any) {
    return this.client.importPrivate(this.id, account, privateKey, passphrase);
  }

  /**
   * Import public key.
   * @param {Number|String} account
   * @param {String} key
   * @returns {Promise}
   */

  importPublic(account: any, publicKey: any) {
    return this.client.importPublic(this.id, account, publicKey);
  }

  /**
   * Import address.
   * @param {Number|String} account
   * @param {String} address
   * @returns {Promise}
   */

  importAddress(account: any, address: any) {
    return this.client.importAddress(this.id, account, address);
  }

  /**
   * Lock a coin.
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */

  lockCoin(hash: any, index: any) {
    return this.client.lockCoin(this.id, hash, index);
  }

  /**
   * Unlock a coin.
   * @param {String} hash
   * @param {Number} index
   * @returns {Promise}
   */

  unlockCoin(hash: any, index: any) {
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

  unlock(passphrase: any, timeout: any) {
    return this.client.unlock(this.id, passphrase, timeout);
  }

  /**
   * Get wallet key.
   * @param {String} address
   * @returns {Promise}
   */

  getKey(address: any) {
    return this.client.getKey(this.id, address);
  }

  /**
   * Get wallet key WIF dump.
   * @param {String} address
   * @param {String?} passphrase
   * @returns {Promise}
   */

  getWIF(address: any, passphrase: any) {
    return this.client.getWIF(this.id, address, passphrase);
  }

  /**
   * Add a public account key to the wallet for multisig.
   * @param {String} account
   * @param {String} key - Account (bip44) key (base58).
   * @returns {Promise}
   */

  addSharedKey(account: any, accountKey: any) {
    return this.client.addSharedKey(this.id, account, accountKey);
  }

  /**
   * Remove a public account key to the wallet for multisig.
   * @param {String} account
   * @param {String} key - Account (bip44) key (base58).
   * @returns {Promise}
   */

  removeSharedKey(account: any, accountKey: any) {
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
