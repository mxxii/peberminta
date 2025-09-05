import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { condition } from './condition.ts';
import { many } from './many.ts';
import { fail } from './fail.ts';
import { any } from './any.ts';


test('condition - match', numbers123Macro, many(condition(
  (data, i) => i % 2 === 0,
  tokenOdd,
  tokenEven,
)), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('condition - stop by condition', numbers123Macro, many(condition(
  (data, i) => i < 2,
  any,
  fail,
)), 0, {
  matched: true,
  position: 2,
  value: [11, 22],
});
