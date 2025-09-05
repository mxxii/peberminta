import test from 'ava';

import { numbers123Macro, tokenEven, tokenNegative, tokenOdd } from '../../test/_testUtil.ts';

import { emit } from './emit.ts';
import { fail } from './fail.ts';
import { last } from './last.ts';


test('last - match 0', numbers123Macro, last(
  tokenOdd,
  tokenEven,
), 0, {
  matched: true,
  position: 1,
  value: 11,
});

test('last - match 1', numbers123Macro, last(
  tokenOdd,
  tokenEven,
), 1, {
  matched: true,
  position: 2,
  value: 22,
});

test('last - match with last matcher', numbers123Macro, last(
  fail,
  emit(111),
  emit(222),
  fail,
), 0, {
  matched: true,
  position: 0,
  value: 222,
});

test('last - nonmatch', numbers123Macro, last(
  tokenOdd,
  tokenNegative,
), 1, { matched: false });

test('last - on end', numbers123Macro, last(
  tokenOdd,
  tokenEven,
), 3, { matched: false });

test('last - empty', numbers123Macro, last(), 0, { matched: false });
