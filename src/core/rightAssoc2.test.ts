import test from 'ava';

import { numbers123Macro, tokenBinaryOp, tokenEven } from '../../test/_testUtil.ts';

import { rightAssoc2 } from './rightAssoc2.ts';
import { left } from './left.ts';
import { ahead } from './ahead.ts';
import { emit } from './emit.ts';
import { any } from './any.ts';


test('rightAssoc2 - match 0', numbers123Macro, rightAssoc2(
  left(any, ahead(any)),
  emit((x: number, y: number) => x * 2 + y),
  any,
), 0, {
  matched: true,
  position: 3,
  value: 99, // (11 * 2 + (22 * 2 + (33)))
});

test('rightAssoc2 - nonmatch 1', numbers123Macro, rightAssoc2(
  any,
  tokenBinaryOp,
  any,
), 1, { matched: false });

test('rightAssoc2 - match 2', numbers123Macro, rightAssoc2(
  any,
  tokenBinaryOp,
  any,
), 2, {
  matched: true,
  position: 3,
  value: 33,
});

test('rightAssoc2 - match - only right', numbers123Macro, rightAssoc2(
  tokenEven,
  tokenBinaryOp,
  any,
), 0, {
  matched: true,
  position: 1,
  value: 11,
});
