import test from 'ava';

import { numbers123Macro, tokenEven } from '../../test/_testUtil.ts';

import { not } from './not.ts';


test('not - match', numbers123Macro, not(
  tokenEven,
), 0, {
  matched: true,
  position: 0,
  value: true,
});

test('not - nonmatch', numbers123Macro, not(
  tokenEven,
), 1, { matched: false });
