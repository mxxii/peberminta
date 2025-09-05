import test from 'ava';

import { numbers123Macro, tokenAddX, tokenEven } from '../../test/_testUtil.ts';

import { rightAssoc1 } from './rightAssoc1.ts';
import { emit } from './emit.ts';


test('rightAssoc1 - match', numbers123Macro, rightAssoc1(
  tokenAddX,
  emit(100),
), 0, {
  matched: true,
  position: 3,
  value: 166,
});

test('rightAssoc1 - nonmatch', numbers123Macro, rightAssoc1(
  tokenAddX,
  tokenEven,
), 0, { matched: false });
