import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { takeN } from './takeN.ts';
import { any } from './any.ts';
import { fail } from './fail.ts';


test('takeN - match 2 (of 3)', numbers123Macro, takeN(
  any,
  2,
), 0, {
  matched: true,
  position: 2,
  value: [11, 22],
});

test('takeN - match 3 (of 3)', numbers123Macro, takeN(
  any,
  3,
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('takeN - match 0 (of 3)', numbers123Macro, takeN(
  any,
  0,
), 0, {
  matched: true,
  position: 0,
  value: [],
});

test("takeN - don't match 4 (of 3)", numbers123Macro, takeN(
  any,
  4,
), 0, { matched: false });

test("takeN - don't match 2 (of 3) when provided parser doesn't match", numbers123Macro, takeN(
  fail,
  2,
), 0, { matched: false });
