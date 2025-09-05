import test from 'ava';

import { numbers123Macro, tokenAddX, tokenEven } from '../../test/_testUtil.ts';

import { leftAssoc1 } from './leftAssoc1.ts';
import { any } from './any.ts';


test('leftAssoc1 - match', numbers123Macro, leftAssoc1(
  any,
  tokenAddX,
), 0, {
  matched: true,
  position: 3,
  value: 66,
});

test('leftAssoc1 - nonmatch', numbers123Macro, leftAssoc1(
  tokenEven,
  tokenAddX,
), 0, { matched: false });
