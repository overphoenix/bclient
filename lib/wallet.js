"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("bsert");
const bcurl = require("bcurl");
const node_events_1 = require("node:events");
class WalletClient extends bcurl.Client {
    constructor(options) {
        super(options);
        this.wallets = new Map();
    }
    init() {
        super.bind("tx", (id, details) => {
            this.dispatch(id, "tx", details);
        });
        super.bind("confirmed", (id, details) => {
            this.dispatch(id, "confirmed", details);
        });
        super.bind("unconfirmed", (id, details) => {
            this.dispatch(id, "unconfirmed", details);
        });
        super.bind("conflict", (id, details) => {
            this.dispatch(id, "conflict", details);
        });
        super.bind("updated", (id, details) => {
            this.dispatch(id, "updated", details);
        });
        super.bind("address", (id, receive) => {
            this.dispatch(id, "address", receive);
        });
        super.bind("balance", (id, balance) => {
            this.dispatch(id, "balance", balance);
        });
    }
    dispatch(id, event, ...args) {
        const wallet = this.wallets.get(id);
        if (wallet)
            wallet.emit(event, ...args);
    }
    async open() {
        await super.open();
        this.init();
    }
    async close() {
        await super.close();
        this.wallets = new Map();
    }
    async auth() {
        await super.call("auth", this.password);
    }
    execute(name, params) {
        return super.execute("/", name, params);
    }
    wallet(id, token) {
        return new Wallet(this, id, token);
    }
    all(token) {
        return super.call("join", "*", token);
    }
    none() {
        return super.call("leave", "*");
    }
    join(id, token) {
        return super.call("join", id, token);
    }
    leave(id) {
        return super.call("leave", id);
    }
    rescan(height) {
        return super.post("/rescan", { height });
    }
    resend() {
        return super.post("/resend");
    }
    backup(path) {
        return super.post("/backup", { path });
    }
    getWallets() {
        return super.get("/wallet");
    }
    createWallet(id, options) {
        return super.put(`/wallet/${id}`, options);
    }
    getHistory(id, account) {
        return super.get(`/wallet/${id}/tx/history`, { account });
    }
    getCoins(id, account) {
        return super.get(`/wallet/${id}/coin`, { account });
    }
    getPending(id, account) {
        return super.get(`/wallet/${id}/tx/unconfirmed`, { account });
    }
    getBalance(id, account) {
        return super.get(`/wallet/${id}/balance`, { account });
    }
    getLast(id, account, limit) {
        return super.get(`/wallet/${id}/tx/last`, { account, limit });
    }
    getRange(id, account, options) {
        return super.get(`/wallet/${id}/tx/range`, {
            account: account,
            start: options.start,
            end: options.end,
            limit: options.limit,
            reverse: options.reverse,
        });
    }
    getTX(id, hash) {
        return super.get(`/wallet/${id}/tx/${hash}`);
    }
    getBlocks(id) {
        return super.get(`/wallet/${id}/block`);
    }
    getBlock(id, height) {
        return super.get(`/wallet/${id}/block/${height}`);
    }
    getCoin(id, hash, index) {
        return super.get(`/wallet/${id}/coin/${hash}/${index}`);
    }
    zap(id, account, age) {
        return super.post(`/wallet/${id}/zap`, { account, age });
    }
    createTX(id, options) {
        return super.post(`/wallet/${id}/create`, options);
    }
    send(id, options) {
        return super.post(`/wallet/${id}/send`, options);
    }
    sign(id, options) {
        return super.post(`/wallet/${id}/sign`, options);
    }
    getInfo(id) {
        return super.get(`/wallet/${id}`);
    }
    getAccounts(id) {
        return super.get(`/wallet/${id}/account`);
    }
    getMaster(id) {
        return super.get(`/wallet/${id}/master`);
    }
    getAccount(id, account) {
        return super.get(`/wallet/${id}/account/${account}`);
    }
    createAccount(id, name, options) {
        return super.put(`/wallet/${id}/account/${name}`, options);
    }
    createAddress(id, account) {
        return super.post(`/wallet/${id}/address`, { account });
    }
    createChange(id, account) {
        return super.post(`/wallet/${id}/change`, { account });
    }
    createNested(id, account) {
        return super.post(`/wallet/${id}/nested`, { account });
    }
    setPassphrase(id, passphrase, old) {
        return super.post(`/wallet/${id}/passphrase`, { passphrase, old });
    }
    retoken(id, passphrase) {
        return super.post(`/wallet/${id}/retoken`, {
            passphrase,
        });
    }
    importPrivate(id, account, privateKey, passphrase) {
        return super.post(`/wallet/${id}/import`, {
            account,
            privateKey,
            passphrase,
        });
    }
    importPublic(id, account, publicKey) {
        return super.post(`/wallet/${id}/import`, {
            account,
            publicKey,
        });
    }
    importAddress(id, account, address) {
        return super.post(`/wallet/${id}/import`, { account, address });
    }
    lockCoin(id, hash, index) {
        return super.put(`/wallet/${id}/locked/${hash}/${index}`);
    }
    unlockCoin(id, hash, index) {
        return super.del(`/wallet/${id}/locked/${hash}/${index}`);
    }
    getLocked(id) {
        return super.get(`/wallet/${id}/locked`);
    }
    lock(id) {
        return super.post(`/wallet/${id}/lock`);
    }
    unlock(id, passphrase, timeout) {
        return super.post(`/wallet/${id}/unlock`, { passphrase, timeout });
    }
    getKey(id, address) {
        return super.get(`/wallet/${id}/key/${address}`);
    }
    getWIF(id, address, passphrase) {
        return super.get(`/wallet/${id}/wif/${address}`, { passphrase });
    }
    addSharedKey(id, account, accountKey) {
        return super.put(`/wallet/${id}/shared-key`, { account, accountKey });
    }
    removeSharedKey(id, account, accountKey) {
        return SUPER.del(`/wallet/${id}/shared-key`, { account, accountKey });
    }
    resendWallet(id) {
        return super.post(`/wallet/${id}/resend`);
    }
}
exports.default = WalletClient;
class Wallet extends node_events_1.default {
    constructor(parent, id, token) {
        super();
        this.parent = parent;
        this.client = parent.clone();
        this.client.token = token;
        this.id = id;
        this.token = token;
    }
    async open() {
        await this.parent.join(this.id, this.token);
        this.parent.wallets.set(this.id, this);
    }
    async close() {
        await this.parent.leave(this.id);
        this.parent.wallets.delete(this.id);
    }
    getHistory(account) {
        return this.client.getHistory(this.id, account);
    }
    getCoins(account) {
        return this.client.getCoins(this.id, account);
    }
    getPending(account) {
        return this.client.getPending(this.id, account);
    }
    getBalance(account) {
        return this.client.getBalance(this.id, account);
    }
    getLast(account, limit) {
        return this.client.getLast(this.id, account, limit);
    }
    getRange(account, options) {
        return this.client.getRange(this.id, account, options);
    }
    getTX(hash) {
        return this.client.getTX(this.id, hash);
    }
    getBlocks() {
        return this.client.getBlocks(this.id);
    }
    getBlock(height) {
        return this.client.getBlock(this.id, height);
    }
    getCoin(hash, index) {
        return this.client.getCoin(this.id, hash, index);
    }
    zap(account, age) {
        return this.client.zap(this.id, account, age);
    }
    createTX(options) {
        return this.client.createTX(this.id, options);
    }
    send(options) {
        return this.client.send(this.id, options);
    }
    sign(options) {
        return this.client.sign(this.id, options);
    }
    getInfo() {
        return this.client.getInfo(this.id);
    }
    getAccounts() {
        return this.client.getAccounts(this.id);
    }
    getMaster() {
        return this.client.getMaster(this.id);
    }
    getAccount(account) {
        return this.client.getAccount(this.id, account);
    }
    createAccount(name, options) {
        return this.client.createAccount(this.id, name, options);
    }
    createAddress(account) {
        return this.client.createAddress(this.id, account);
    }
    createChange(account) {
        return this.client.createChange(this.id, account);
    }
    createNested(account) {
        return this.client.createNested(this.id, account);
    }
    setPassphrase(passphrase, old) {
        return this.client.setPassphrase(this.id, passphrase, old);
    }
    async retoken(passphrase) {
        const result = await this.client.retoken(this.id, passphrase);
        assert(result);
        assert(typeof result.token === "string");
        this.token = result.token;
        return result;
    }
    importPrivate(account, privateKey, passphrase) {
        return this.client.importPrivate(this.id, account, privateKey, passphrase);
    }
    importPublic(account, publicKey) {
        return this.client.importPublic(this.id, account, publicKey);
    }
    importAddress(account, address) {
        return this.client.importAddress(this.id, account, address);
    }
    lockCoin(hash, index) {
        return this.client.lockCoin(this.id, hash, index);
    }
    unlockCoin(hash, index) {
        return this.client.unlockCoin(this.id, hash, index);
    }
    getLocked() {
        return this.client.getLocked(this.id);
    }
    lock() {
        return this.client.lock(this.id);
    }
    unlock(passphrase, timeout) {
        return this.client.unlock(this.id, passphrase, timeout);
    }
    getKey(address) {
        return this.client.getKey(this.id, address);
    }
    getWIF(address, passphrase) {
        return this.client.getWIF(this.id, address, passphrase);
    }
    addSharedKey(account, accountKey) {
        return this.client.addSharedKey(this.id, account, accountKey);
    }
    removeSharedKey(account, accountKey) {
        return this.client.removeSharedKey(this.id, account, accountKey);
    }
    resend() {
        return this.client.resendWallet(this.id);
    }
}
