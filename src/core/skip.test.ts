import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { skip } from './skip.ts';
import { discard } from '../core.ts';


test('skip - match', numbers123Macro, skip(
  tokenOdd,
  tokenEven,
  tokenOdd,
), 0, {
  matched: true,
  position: 3,
  value: null,
});

test('skip - not enough tokens', numbers123Macro, skip(
  tokenEven,
  tokenOdd,
  tokenEven,
), 1, { matched: false });

test('skip - one fail - discard alias', numbers123Macro, discard(
  tokenEven,
  tokenEven,
  tokenEven,
), 0, { matched: false });

test('skip - empty match', numbers123Macro, skip(), 0, {
  matched: true,
  position: 0,
  value: null,
});
