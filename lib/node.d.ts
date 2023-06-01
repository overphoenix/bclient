/// <reference types="node" />
import * as bcurl from "bcurl";
import { ClientOptions } from "./types";
export default class NodeClient extends bcurl.Client {
    constructor(options?: ClientOptions);
    auth(): Promise<void>;
    execute(name: string, params: any): any;
    getMempool(): any;
    getInfo(): any;
    getCoinsByAddress(address: string): any;
    getCoinsByAddresses(addresses: Array<any>): any;
    getCoin(hash: string, index: number): any;
    getTXByAddress(address: string): any;
    getTXByAddresses(addresses: Array<any>): any;
    getTX(hash: string): any;
    getBlock(block: string | number): any;
    broadcast(tx: string): any;
    reset(height: number): any;
    watchChain(): any;
    watchMempool(): any;
    getTip(): any;
    getEntry(block: any): any;
    getHashes(start: any, end: any): any;
    send(tx: Buffer): any;
    setFilter(filter: Buffer): any;
    addFilter(chunks: any): any;
    resetFilter(): any;
    estimateFee(blocks: number | null): any;
    rescan(start?: string | number): any;
}
