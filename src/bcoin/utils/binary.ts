/*!
 * binary.js - binary search utils for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

/**
 * Perform a binary search on a sorted array.
 * @param {Array} items
 * @param {Object} key
 * @param {Function} compare
 * @param {Boolean?} insert
 * @returns {Number} Index.
 */

export const search = function search(
  items: Array<any>,
  key: any,
  compare: any,
  insert: any,
) {
  let start = 0;
  let end = items.length - 1;

  while (start <= end) {
    const pos = (start + end) >>> 1;
    const cmp = compare(items[pos], key);

    if (cmp === 0) return pos;

    if (cmp < 0) start = pos + 1;
    else end = pos - 1;
  }

  if (!insert) return -1;

  return start;
};

/**
 * Perform a binary insert on a sorted array.
 * @param {Array} items
 * @param {Object} item
 * @param {Function} compare
 * @returns {Number} index
 */

export const insert = function insert(
  items: Array<any>,
  item: any,
  compare: any,
  uniq?: boolean,
) {
  const i = search(items, item, compare, true);

  if (uniq && i < items.length) {
    if (compare(items[i], item) === 0) return -1;
  }

  if (i === 0) items.unshift(item);
  else if (i === items.length) items.push(item);
  else items.splice(i, 0, item);

  return i;
};

/**
 * Perform a binary removal on a sorted array.
 * @param {Array} items
 * @param {Object} item
 * @param {Function} compare
 * @returns {Boolean}
 */

export const remove = function remove(
  items: Array<any>,
  item: any,
  compare: any,
) {
  const i = search(items, item, compare, false);

  if (i === -1) return false;

  splice(items, i);

  return true;
};

/*
 * Helpers
 */

function splice(list: Array<any>, i: number) {
  if (i === 0) {
    list.shift();
    return;
  }

  let k = i + 1;

  while (k < list.length) list[i++] = list[k++];

  list.pop();
}
