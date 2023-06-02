/*!
 * amount.js - amount object for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
export default class Amount {
    private value;
    constructor(value?: string | number, unit?: string | number);
    fromOptions(value: any, unit: any): this;
    toValue(): number;
    toSatoshis(num?: boolean): string | number;
    toBits(num: any): any;
    toMBTC(num: any): any;
    toBTC(num?: number): any;
    to(unit: any, num: any): any;
    toString(): any;
    fromValue(value: any): this;
    fromSatoshis(value: any): this;
    fromBits(value: any): this;
    fromMBTC(value: any): this;
    fromBTC(value: any): this;
    from(unit: any, value: any): this;
    static fromOptions(value: any, unit: any): Amount;
    static fromValue(value: any): Amount;
    static fromSatoshis(value: any): Amount;
    static fromBits(value: any): Amount;
    static fromMBTC(value: any): Amount;
    static fromBTC(value: any): Amount;
    static from(unit: any, value: any): Amount;
    static btc(value: number | string, num: boolean): any;
    static value(str: any): any;
    static encode(value: number, exp: number, num?: boolean): any;
    static decode(value: string | number, exp: number): any;
}
