import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { right } from './right.ts';


test('right - match', numbers123Macro, right(
  tokenOdd,
  tokenEven,
), 0, {
  matched: true,
  position: 2,
  value: 22,
});

test('right - left fail', numbers123Macro, right(
  tokenEven,
  tokenEven,
), 0, { matched: false });
