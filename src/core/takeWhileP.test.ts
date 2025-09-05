import test from 'ava';

import { numbers123Macro, tokenOdd } from '../../test/_testUtil.ts';

import { takeWhileP } from './takeWhileP.ts';
import { any } from './any.ts';


test('takeWhileP', numbers123Macro, takeWhileP(
  any,
  tokenOdd,
), 0, {
  matched: true,
  position: 1,
  value: [11],
});
