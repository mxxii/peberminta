import test from 'ava';

import { numbers123Macro, tokenEven, tokenNegative, tokenOdd } from '../../test/_testUtil.ts';

import { emit } from './emit.ts';
import { fail } from './fail.ts';
import { first } from './first.ts';
import { choice, or } from '../core.ts';


test('first - match 0', numbers123Macro, first(
  tokenOdd,
  tokenEven,
), 0, {
  matched: true,
  position: 1,
  value: 11,
});

test('first - match 1 - or alias', numbers123Macro, or(
  tokenOdd,
  tokenEven,
), 1, {
  matched: true,
  position: 2,
  value: 22,
});

test('first - match with first matcher', numbers123Macro, first(
  fail,
  emit(111),
  emit(222),
  fail,
), 0, {
  matched: true,
  position: 0,
  value: 111,
});

test('first - nonmatch', numbers123Macro, first(
  tokenOdd,
  tokenNegative,
), 1, { matched: false });

test('first - on end - choice alias', numbers123Macro, choice(
  tokenOdd,
  tokenEven,
), 3, { matched: false });

test('first - empty', numbers123Macro, first(), 0, { matched: false });
