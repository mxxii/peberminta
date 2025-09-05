import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { chain } from './chain.ts';
import { any } from './any.ts';
import { fail } from './fail.ts';


test('chain - match 0', numbers123Macro, chain(
  any,
  x => (x % 2 === 0)
    ? tokenOdd
    : tokenEven,
), 0, {
  matched: true,
  position: 2,
  value: 22,
});

test('chain - match 1', numbers123Macro, chain(
  any,
  x => (x % 2 === 0)
    ? tokenOdd
    : tokenEven,
), 1, {
  matched: true,
  position: 3,
  value: 33,
});

test('chain - stop by condition', numbers123Macro, chain(
  any,
  (x, data, i, j) => (x + i + j === 25) // 22 + 1 + 2
    ? fail
    : any,
), 1, { matched: false });

test('chain - not enough tokens', numbers123Macro, chain(
  any,
  x => (x % 2 === 0)
    ? tokenOdd
    : tokenEven,
), 2, { matched: false });
