// exported from bcoin

/*!
 * amount.js - amount object for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

import * as assert from "bsert";
import { fromFloat, toFloat, encode, decode } from "../utils/fixed";
import { inspectSymbol } from "../utils";

/**
 * Amount
 * Represents a bitcoin amount (satoshis internally).
 * @alias module:btc.Amount
 * @property {Amount} value
 */
export default class Amount {
  private value: number;

  /**
   * Create an amount.
   * @constructor
   * @param {(String|Number)?} value
   * @param {String?} unit
   */
  constructor(value?: string | number, unit?: string | number) {
    this.value = 0;

    if (value != null) this.fromOptions(value, unit);
  }

  /**
   * Inject properties from options.
   * @private
   * @param {(String|Number)?} value
   * @param {String?} unit
   * @returns {Amount}
   */

  fromOptions(value: any, unit: any) {
    if (typeof unit === "string") return this.from(unit, value);

    if (typeof value === "number") return this.fromValue(value);

    return this.fromBTC(value);
  }

  /**
   * Get satoshi value.
   * @returns {Amount}
   */

  toValue() {
    return this.value;
  }

  /**
   * Get satoshi string or value.
   * @param {Boolean?} num
   * @returns {String|Amount}
   */

  toSatoshis(num?: boolean) {
    if (num) return this.value;

    return this.value.toString(10);
  }

  /**
   * Get bits string or value.
   * @param {Boolean?} num
   * @returns {String|Amount}
   */

  toBits(num: any) {
    return Amount.encode(this.value, 2, num);
  }

  /**
   * Get mbtc string or value.
   * @param {Boolean?} num
   * @returns {String|Amount}
   */

  toMBTC(num: any) {
    return Amount.encode(this.value, 5, num);
  }

  /**
   * Get btc string or value.
   * @param {Boolean?} num
   * @returns {String|Amount}
   */

  toBTC(num?: boolean) {
    return Amount.encode(this.value, 8, num);
  }

  /**
   * Get unit string or value.
   * @param {String} unit - Can be `sat`,
   * `ubtc`, `bits`, `mbtc`, or `btc`.
   * @param {Boolean?} num
   * @returns {String|Amount}
   */

  to(unit: any, num: any) {
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

  /**
   * Convert amount to bitcoin string.
   * @returns {String}
   */

  toString() {
    return this.toBTC();
  }

  /**
   * Inject properties from value.
   * @private
   * @param {Amount} value
   * @returns {Amount}
   */

  fromValue(value: any) {
    assert(
      Number.isSafeInteger(value) && value >= 0,
      "Value must be an int64.",
    );
    this.value = value;
    return this;
  }

  /**
   * Inject properties from satoshis.
   * @private
   * @param {Number|String} value
   * @returns {Amount}
   */

  fromSatoshis(value: any) {
    this.value = Amount.decode(value, 0);
    return this;
  }

  /**
   * Inject properties from bits.
   * @private
   * @param {Number|String} value
   * @returns {Amount}
   */

  fromBits(value: any) {
    this.value = Amount.decode(value, 2);
    return this;
  }

  /**
   * Inject properties from mbtc.
   * @private
   * @param {Number|String} value
   * @returns {Amount}
   */

  fromMBTC(value: any) {
    this.value = Amount.decode(value, 5);
    return this;
  }

  /**
   * Inject properties from btc.
   * @private
   * @param {Number|String} value
   * @returns {Amount}
   */

  fromBTC(value: any) {
    this.value = Amount.decode(value, 8);
    return this;
  }

  /**
   * Inject properties from unit.
   * @private
   * @param {String} unit
   * @param {Number|String} value
   * @returns {Amount}
   */

  from(unit: any, value: any) {
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

  /**
   * Instantiate amount from options.
   * @param {(String|Number)?} value
   * @param {String?} unit
   * @returns {Amount}
   */

  static fromOptions(value: any, unit: any) {
    return new Amount().fromOptions(value, unit);
  }

  /**
   * Instantiate amount from value.
   * @private
   * @param {Amount} value
   * @returns {Amount}
   */

  static fromValue(value: any) {
    return new Amount().fromValue(value);
  }

  /**
   * Instantiate amount from satoshis.
   * @param {Number|String} value
   * @returns {Amount}
   */

  static fromSatoshis(value: any) {
    return new Amount().fromSatoshis(value);
  }

  /**
   * Instantiate amount from bits.
   * @param {Number|String} value
   * @returns {Amount}
   */

  static fromBits(value: any) {
    return new Amount().fromBits(value);
  }

  /**
   * Instantiate amount from mbtc.
   * @param {Number|String} value
   * @returns {Amount}
   */

  static fromMBTC(value: any) {
    return new Amount().fromMBTC(value);
  }

  /**
   * Instantiate amount from btc.
   * @param {Number|String} value
   * @returns {Amount}
   */

  static fromBTC(value: any) {
    return new Amount().fromBTC(value);
  }

  /**
   * Instantiate amount from unit.
   * @param {String} unit
   * @param {Number|String} value
   * @returns {Amount}
   */

  static from(unit: any, value: any) {
    return new Amount().from(unit, value);
  }

  /**
   * Inspect amount.
   * @returns {String}
   */

  [inspectSymbol]() {
    return `<Amount: ${this.toString()}>`;
  }

  /**
   * Safely convert satoshis to a BTC string.
   * This function explicitly avoids any
   * floating point arithmetic.
   * @param {Amount} value - Satoshis.
   * @param {Boolean} num
   * @returns {String} BTC string.
   */

  static btc(value: number | string, num?: boolean) {
    if (typeof value === "string") return value;

    return Amount.encode(value, 8, num);
  }

  /**
   * Safely convert a BTC string to satoshis.
   * @param {String} str - BTC
   * @returns {Amount} Satoshis.
   * @throws on parse error
   */

  static value(str: any) {
    if (typeof str === "number") return str;

    return Amount.decode(str, 8);
  }

  /**
   * Safely convert satoshis to a BTC string.
   * @param {Amount} value
   * @param {Number} exp - Exponent.
   * @param {Boolean} num - Return a number.
   * @returns {String|Number}
   */

  static encode(value: number, exp: number, num?: boolean) {
    if (num) return toFloat(value, exp);
    return encode(value, exp);
  }

  /**
   * Safely convert a BTC string to satoshis.
   * @param {String|Number} value - BTC
   * @param {Number} exp - Exponent.
   * @returns {Amount} Satoshis.
   * @throws on parse error
   */

  static decode(value: string | number, exp: number) {
    if (typeof value === "number") return fromFloat(value, exp);
    return decode(value, exp);
  }
}
