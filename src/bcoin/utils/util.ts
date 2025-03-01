/*!
 * util.js - utils for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

import * as assert from "bsert";

/**
 * Return hrtime (shim for browser).
 * @param {Array} time
 * @returns {Array} [seconds, nanoseconds]
 */

export const bench = function bench(time) {
  if (!process.hrtime) {
    const now = Date.now();

    if (time) {
      const [hi, lo] = time;
      const start = hi * 1000 + lo / 1e6;
      return now - start;
    }

    const ms = now % 1000;

    // Seconds
    const hi = (now - ms) / 1000;

    // Nanoseconds
    const lo = ms * 1e6;

    return [hi, lo];
  }

  if (time) {
    const [hi, lo] = process.hrtime(time);
    return hi * 1000 + lo / 1e6;
  }

  return process.hrtime();
};

/**
 * Get current time in unix time (seconds).
 * @returns {Number}
 */

export const now = function now() {
  return Math.floor(Date.now() / 1000);
};

/**
 * Get current time in unix time (milliseconds).
 * @returns {Number}
 */

export const ms = function ms() {
  return Date.now();
};

/**
 * Create a Date ISO string from time in unix time (seconds).
 * @param {Number?} time - Seconds in unix time.
 * @returns {String}
 */

export const date = function date(time) {
  if (time == null) time = now();

  return new Date(time * 1000).toISOString().slice(0, -5) + "Z";
};

/**
 * Get unix seconds from a Date string.
 * @param {String?} date - Date ISO String.
 * @returns {Number}
 */

export const time = function time(date) {
  if (date == null) return now();

  return (new Date(date) / 1000) | 0;
};

/**
 * Reverse a hex-string.
 * @param {Buffer}
 * @returns {String} Reversed hex string.
 */

export const revHex = function revHex(buf) {
  assert(Buffer.isBuffer(buf));

  return Buffer.from(buf).reverse().toString("hex");
};

export const fromRev = function fromRev(str) {
  assert(typeof str === "string");
  assert((str.length & 1) === 0);

  return Buffer.from(str, "hex").reverse();
};
