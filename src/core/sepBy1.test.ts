import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { sepBy1 } from './sepBy1.ts';


test('sepBy1 - match 0', numbers123Macro, sepBy1(
  tokenOdd,
  tokenEven,
), 0, {
  matched: true,
  position: 3,
  value: [11, 33],
});

test('sepBy1 - match 2', numbers123Macro, sepBy1(
  tokenOdd,
  tokenEven,
), 2, {
  matched: true,
  position: 3,
  value: [33],
});

test('sepBy1 - dangling separator not consumed', numbers123Macro, sepBy1(
  tokenEven,
  tokenOdd,
), 1, {
  matched: true,
  position: 2,
  value: [22],
});

test('sepBy1 - nonmatch', numbers123Macro, sepBy1(
  tokenEven,
  tokenOdd,
), 0, { matched: false });
