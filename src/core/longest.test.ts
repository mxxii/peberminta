import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { longest } from './longest.ts';
import { middle } from './middle.ts';
import { emit } from './emit.ts';
import { right } from './right.ts';


test('longest - empty', numbers123Macro, longest(), 0, { matched: false });

test('longest - take longest', numbers123Macro, longest(
  tokenOdd,
  middle(tokenOdd, emit(99), tokenEven),
), 0, {
  matched: true,
  position: 2,
  value: 99,
});

test('longest - take first of equal length', numbers123Macro, longest(
  tokenOdd,
  right(tokenOdd, emit(99)),
), 0, {
  matched: true,
  position: 1,
  value: 11,
});
