import * as assert from "bsert";
import * as bcurl from "bcurl";
import { Options } from "./types";

/**
 * Node Client
 * @extends {bcurl.Client}
 */
export default class NodeClient extends bcurl.Client {
  constructor(options: Options) {
    super(options);
  }

  /**
   * Auth with server.
   * @returns {Promise}
   */
  async auth() {
    await super.call("auth", this.password);
    await this.watchChain();
    await this.watchMempool();
  }

  /**
   * Make an RPC call.
   * @returns {Promise}
   */

  execute(name: string, params: any) {
    return super.execute("/", name, params);
  }

  /**
   * Get a mempool snapshot.
   * @returns {Promise}
   */

  getMempool() {
    return super.get("/mempool");
  }

  /**
   * Get some info about the server (network and version).
   * @returns {Promise}
   */

  getInfo() {
    return super.get("/");
  }

  /**
   * Get coins that pertain to an address from the mempool or chain database.
   * Takes into account spent coins in the mempool.
   * @param {String} address
   * @returns {Promise}
   */

  getCoinsByAddress(address: string) {
    assert(typeof address === "string");
    return super.get(`/coin/address/${address}`);
  }

  /**
   * Get coins that pertain to addresses from the mempool or chain database.
   * Takes into account spent coins in the mempool.
   * @param {String[]} addresses
   * @returns {Promise}
   */

  getCoinsByAddresses(addresses: Array<any>) {
    assert(Array.isArray(addresses));
    return super.post("/coin/address", { addresses });
  }

  /**
   * Retrieve a coin from the mempool or chain database.
   * Takes into account spent coins in the mempool.
   * @param {Hash} hash
   * @param {Number} index
   * @returns {Promise}
   */

  getCoin(hash: string, index: number) {
    assert(typeof hash === "string");
    assert(index >>> 0 === index);
    return super.get(`/coin/${hash}/${index}`);
  }

  /**
   * Retrieve transactions pertaining to an
   * address from the mempool or chain database.
   * @param {String} address
   * @returns {Promise}
   */

  getTXByAddress(address: string) {
    assert(typeof address === "string");
    return super.get(`/tx/address/${address}`);
  }

  /**
   * Retrieve transactions pertaining to
   * addresses from the mempool or chain database.
   * @param {String[]} addresses
   * @returns {Promise}
   */

  getTXByAddresses(addresses: Array<any>) {
    assert(Array.isArray(addresses));
    return super.post("/tx/address", { addresses });
  }

  /**
   * Retrieve a transaction from the mempool or chain database.
   * @param {Hash} hash
   * @returns {Promise}
   */

  getTX(hash: string) {
    assert(typeof hash === "string");
    return super.get(`/tx/${hash}`);
  }

  /**
   * Retrieve a block from the chain database.
   * @param {Hash|Number} block
   * @returns {Promise}
   */

  getBlock(block: string | number) {
    assert(typeof block === "string" || typeof block === "number");
    return super.get(`/block/${block}`);
  }

  /**
   * Add a transaction to the mempool and broadcast it.
   * @param {TX} tx
   * @returns {Promise}
   */

  broadcast(tx: string) {
    assert(typeof tx === "string");
    return super.post("/broadcast", { tx });
  }

  /**
   * Reset the chain.
   * @param {Number} height
   * @returns {Promise}
   */

  reset(height: number) {
    return super.post("/reset", { height });
  }

  /**
   * Watch the blockchain.
   * @private
   * @returns {Promise}
   */

  watchChain() {
    return super.call("watch chain");
  }

  /**
   * Watch the blockchain.
   * @private
   * @returns {Promise}
   */

  watchMempool() {
    return super.call("watch mempool");
  }

  /**
   * Get chain tip.
   * @returns {Promise}
   */

  getTip() {
    return super.call("get tip");
  }

  /**
   * Get chain entry.
   * @param {Hash} hash
   * @returns {Promise}
   */

  getEntry(block: any) {
    return super.call("get entry", block);
  }

  /**
   * Get hashes.
   * @param {Number} [start=-1]
   * @param {Number} [end=-1]
   * @returns {Promise}
   */

  getHashes(start: any, end: any) {
    return super.call("get hashes", start, end);
  }

  /**
   * Send a transaction. Do not wait for promise.
   * @param {TX} tx
   * @returns {Promise}
   */

  send(tx: Buffer) {
    assert(Buffer.isBuffer(tx));
    return super.call("send", tx);
  }

  /**
   * Set bloom filter.
   * @param {Bloom} filter
   * @returns {Promise}
   */

  setFilter(filter: Buffer) {
    assert(Buffer.isBuffer(filter));
    return super.call("set filter", filter);
  }

  /**
   * Add data to filter.
   * @param {Buffer} data
   * @returns {Promise}
   */

  addFilter(chunks: any) {
    if (!Array.isArray(chunks)) chunks = [chunks];

    return super.call("add filter", chunks);
  }

  /**
   * Reset filter.
   * @returns {Promise}
   */

  resetFilter() {
    return super.call("reset filter");
  }

  /**
   * Esimate smart fee.
   * @param {Number?} blocks
   * @returns {Promise}
   */

  estimateFee(blocks: number | null) {
    assert(blocks == null || typeof blocks === "number");
    return super.call("estimate fee", blocks);
  }

  /**
   * Rescan for any missed transactions.
   * @param {Number|Hash} start - Start block.
   * @returns {Promise}
   */

  rescan(start?: string | number) {
    if (start == null) start = 0;

    assert(typeof start === "number" || typeof start === "string");

    return super.call("rescan", start);
  }
}
