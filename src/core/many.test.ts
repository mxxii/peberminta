import test from 'ava';

import { numbers123Macro, tokenOdd } from '../../test/_testUtil.ts';

import { many } from './many.ts';
import { any } from './any.ts';


test('many - to the end', numbers123Macro, many(
  any,
), 1, {
  matched: true,
  position: 3,
  value: [22, 33],
});

test('many - no match', numbers123Macro, many(
  tokenOdd,
), 1, {
  matched: true,
  position: 1,
  value: [],
});
