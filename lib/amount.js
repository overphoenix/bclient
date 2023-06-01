"use strict";
/*!
 * amount.js - amount object for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("bsert");
const fixed = require("./utils/fixed");
const node_util_1 = require("node:util");
const inspectSymbol = node_util_1.inspect.custom || "inspect";
class Amount {
    constructor(value, unit) {
        this.value = 0;
        if (value != null)
            this.fromOptions(value, unit);
    }
    fromOptions(value, unit) {
        if (typeof unit === "string")
            return this.from(unit, value);
        if (typeof value === "number")
            return this.fromValue(value);
        return this.fromBTC(value);
    }
    toValue() {
        return this.value;
    }
    toSatoshis(num) {
        if (num)
            return this.value;
        return this.value.toString(10);
    }
    toBits(num) {
        return Amount.encode(this.value, 2, num);
    }
    toMBTC(num) {
        return Amount.encode(this.value, 5, num);
    }
    toBTC(num) {
        return Amount.encode(this.value, 8, num);
    }
    to(unit, num) {
        switch (unit) {
            case "sat":
                return this.toSatoshis(num);
            case "ubtc":
            case "bits":
                return this.toBits(num);
            case "mbtc":
                return this.toMBTC(num);
            case "btc":
                return this.toBTC(num);
        }
        throw new Error(`Unknown unit "${unit}".`);
    }
    toString() {
        return this.toBTC();
    }
    fromValue(value) {
        assert(Number.isSafeInteger(value) && value >= 0, "Value must be an int64.");
        this.value = value;
        return this;
    }
    fromSatoshis(value) {
        this.value = Amount.decode(value, 0);
        return this;
    }
    fromBits(value) {
        this.value = Amount.decode(value, 2);
        return this;
    }
    fromMBTC(value) {
        this.value = Amount.decode(value, 5);
        return this;
    }
    fromBTC(value) {
        this.value = Amount.decode(value, 8);
        return this;
    }
    from(unit, value) {
        switch (unit) {
            case "sat":
                return this.fromSatoshis(value);
            case "ubtc":
            case "bits":
                return this.fromBits(value);
            case "mbtc":
                return this.fromMBTC(value);
            case "btc":
                return this.fromBTC(value);
        }
        throw new Error(`Unknown unit "${unit}".`);
    }
    static fromOptions(value, unit) {
        return new Amount().fromOptions(value, unit);
    }
    static fromValue(value) {
        return new Amount().fromValue(value);
    }
    static fromSatoshis(value) {
        return new Amount().fromSatoshis(value);
    }
    static fromBits(value) {
        return new Amount().fromBits(value);
    }
    static fromMBTC(value) {
        return new Amount().fromMBTC(value);
    }
    static fromBTC(value) {
        return new Amount().fromBTC(value);
    }
    static from(unit, value) {
        return new Amount().from(unit, value);
    }
    [inspectSymbol]() {
        return `<Amount: ${this.toString()}>`;
    }
    static btc(value, num) {
        if (typeof value === "string")
            return value;
        return Amount.encode(value, 8, num);
    }
    static value(str) {
        if (typeof str === "number")
            return str;
        return Amount.decode(str, 8);
    }
    static encode(value, exp, num) {
        if (num)
            return fixed.toFloat(value, exp);
        return fixed.encode(value, exp);
    }
    static decode(value, exp) {
        if (typeof value === "number")
            return fixed.fromFloat(value, exp);
        return fixed.decode(value, exp);
    }
}
exports.default = Amount;
