import test from 'ava';

import { numbers123Macro, tokenOdd } from '../../test/_testUtil.ts';

import { takeUntilP } from './takeUntilP.ts';
import { any } from './any.ts';


test('takeUntilP', numbers123Macro, takeUntilP(
  any,
  tokenOdd,
), 1, {
  matched: true,
  position: 2,
  value: [22],
});
