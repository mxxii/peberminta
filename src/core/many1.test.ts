import test from 'ava';

import { numbers123Macro, tokenOdd } from '../../test/_testUtil.ts';

import { many1 } from './many1.ts';
import { any } from './any.ts';
import { some } from '../core.ts';


test('many1 - to the end', numbers123Macro, many1(
  any,
), 1, {
  matched: true,
  position: 3,
  value: [22, 33],
});

test('many1 - on end - some alias', numbers123Macro, some(
  any,
), 3, { matched: false });

test('many1 - no match', numbers123Macro, many1(
  tokenOdd,
), 1, { matched: false });
