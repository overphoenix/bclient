"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("bsert");
const bcurl = require("bcurl");
class NodeClient extends bcurl.Client {
    constructor(options) {
        super(options);
    }
    async auth() {
        await super.call("auth", this.password);
        await this.watchChain();
        await this.watchMempool();
    }
    execute(name, params) {
        return super.execute("/", name, params);
    }
    getMempool() {
        return super.get("/mempool");
    }
    getInfo() {
        return super.get("/");
    }
    getCoinsByAddress(address) {
        assert(typeof address === "string");
        return super.get(`/coin/address/${address}`);
    }
    getCoinsByAddresses(addresses) {
        assert(Array.isArray(addresses));
        return super.post("/coin/address", { addresses });
    }
    getCoin(hash, index) {
        assert(typeof hash === "string");
        assert(index >>> 0 === index);
        return super.get(`/coin/${hash}/${index}`);
    }
    getTXByAddress(address) {
        assert(typeof address === "string");
        return super.get(`/tx/address/${address}`);
    }
    getTXByAddresses(addresses) {
        assert(Array.isArray(addresses));
        return super.post("/tx/address", { addresses });
    }
    getTX(hash) {
        assert(typeof hash === "string");
        return super.get(`/tx/${hash}`);
    }
    getBlock(block) {
        assert(typeof block === "string" || typeof block === "number");
        return super.get(`/block/${block}`);
    }
    broadcast(tx) {
        assert(typeof tx === "string");
        return super.post("/broadcast", { tx });
    }
    reset(height) {
        return super.post("/reset", { height });
    }
    watchChain() {
        return super.call("watch chain");
    }
    watchMempool() {
        return super.call("watch mempool");
    }
    getTip() {
        return super.call("get tip");
    }
    getEntry(block) {
        return super.call("get entry", block);
    }
    getHashes(start, end) {
        return super.call("get hashes", start, end);
    }
    send(tx) {
        assert(Buffer.isBuffer(tx));
        return super.call("send", tx);
    }
    setFilter(filter) {
        assert(Buffer.isBuffer(filter));
        return super.call("set filter", filter);
    }
    addFilter(chunks) {
        if (!Array.isArray(chunks))
            chunks = [chunks];
        return super.call("add filter", chunks);
    }
    resetFilter() {
        return super.call("reset filter");
    }
    estimateFee(blocks) {
        assert(blocks == null || typeof blocks === "number");
        return super.call("estimate fee", blocks);
    }
    rescan(start) {
        if (start == null)
            start = 0;
        assert(typeof start === "number" || typeof start === "string");
        return super.call("rescan", start);
    }
}
exports.default = NodeClient;
