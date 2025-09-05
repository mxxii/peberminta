import test from 'ava';

import { numbers123Macro, tokenBinaryOp, tokenEven } from '../../test/_testUtil.ts';

import { leftAssoc2 } from './leftAssoc2.ts';
import { any } from './any.ts';
import { emit } from './emit.ts';


test('leftAssoc2 - match 0', numbers123Macro, leftAssoc2(
  any,
  emit((x: number, y: number) => x * 2 + y),
  any,
), 0, {
  matched: true,
  position: 3,
  value: 121, // ((11 * 2 + 22) * 2 + 33)
});

test('leftAssoc2 - match 1', numbers123Macro, leftAssoc2(
  any,
  tokenBinaryOp,
  any,
), 1, {
  matched: true,
  position: 2,
  value: 22,
});

test('leftAssoc2 - match 2', numbers123Macro, leftAssoc2(
  any,
  tokenBinaryOp,
  any,
), 2, {
  matched: true,
  position: 3,
  value: 33,
});

test('leftAssoc2 - nonmatch', numbers123Macro, leftAssoc2(
  tokenEven,
  tokenBinaryOp,
  any,
), 0, { matched: false });
