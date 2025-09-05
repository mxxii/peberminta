import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { takeMinMax } from './takeMinMax.ts';
import { any } from './any.ts';
import { fail } from './fail.ts';


test('takeMinMax - match 2 items (min: 1, max: 2)', numbers123Macro, takeMinMax(
  any,
  1,
  2,
), 0, {
  matched: true,
  position: 2,
  value: [11, 22],
});

test('takeMinMax - match all 3 items (min: 1, max: 5)', numbers123Macro, takeMinMax(
  any,
  1,
  5,
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('takeMinMax - match 1 item (min: 1, max: 1)', numbers123Macro, takeMinMax(
  any,
  1,
  1,
), 0, {
  matched: true,
  position: 1,
  value: [11],
});

test('takeMinMax - match 0 items with failing parser (min: 0, max: 2)', numbers123Macro, takeMinMax(
  fail,
  0,
  2,
), 0, {
  matched: true,
  position: 0,
  value: [],
});

test('takeMinMax - match 0 items with failing parser (undefined, max: 2)', numbers123Macro, takeMinMax(
  fail,
  undefined,
  2,
), 0, {
  matched: true,
  position: 0,
  value: [],
});

test("takeMinMax - don't match when min not satisfied", numbers123Macro, takeMinMax(
  any,
  4,
  5,
), 0, { matched: false });

test("takeMinMax - don't match when parser fails and min > 0", numbers123Macro, takeMinMax(
  fail,
  1,
  3,
), 0, { matched: false });

test('takeMinMax - match all 3 items when no max limit', numbers123Macro, takeMinMax(
  any,
  1,
  undefined,
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('takeMinMax - match all 3 items when no limits', numbers123Macro, takeMinMax(
  any,
  undefined,
  undefined,
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('takeMinMax - match 0 items with failing parser when no limits', numbers123Macro, takeMinMax(
  fail,
  undefined,
  undefined,
), 0, {
  matched: true,
  position: 0,
  value: [],
});
