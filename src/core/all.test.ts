import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { all } from './all.ts';
import { and } from '../core.ts';


test('all - match', numbers123Macro, all(
  tokenOdd,
  tokenEven,
  tokenOdd,
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('all - not enough tokens', numbers123Macro, all(
  tokenEven,
  tokenOdd,
  tokenEven,
), 1, { matched: false });

test('all - one fail - and alias', numbers123Macro, and(
  tokenEven,
  tokenEven,
  tokenEven,
), 0, { matched: false });

test('all - empty match', numbers123Macro, all(), 0, {
  matched: true,
  position: 0,
  value: [],
});
