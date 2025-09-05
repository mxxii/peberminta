import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { left } from './left.ts';


test('left - match', numbers123Macro, left(
  tokenOdd,
  tokenEven,
), 0, {
  matched: true,
  position: 2,
  value: 11,
});

test('left - right fail', numbers123Macro, left(
  tokenEven,
  tokenEven,
), 1, { matched: false });
