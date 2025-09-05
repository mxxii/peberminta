import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { sepBy } from './sepBy.ts';


test('sepBy - match 0', numbers123Macro, sepBy(
  tokenOdd,
  tokenEven,
), 0, {
  matched: true,
  position: 3,
  value: [11, 33],
});

test('sepBy - dangling separator not consumed', numbers123Macro, sepBy(
  tokenEven,
  tokenOdd,
), 1, {
  matched: true,
  position: 2,
  value: [22],
});

test('sepBy - empty match', numbers123Macro, sepBy(
  tokenEven,
  tokenOdd,
), 0, {
  matched: true,
  position: 0,
  value: [],
});
