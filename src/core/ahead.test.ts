import test from 'ava';

import { numbers123Macro, tokenEven } from '../../test/_testUtil.ts';

import { ahead } from './ahead.ts';
import { lookAhead } from '../core.ts';
import { many } from './many.ts';
import { any } from './any.ts';


test('ahead - match', numbers123Macro, ahead(
  many(any),
), 0, {
  matched: true,
  position: 0,
  value: [11, 22, 33],
});

test('ahead - nonmatch - lookAhead alias', numbers123Macro, lookAhead(
  tokenEven,
), 0, { matched: false });
