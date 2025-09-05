import test from 'ava';

import { numbers123Macro, tokenAlterEvenness, tokenSameEvenness } from '../../test/_testUtil.ts';

import { decide } from './decide.ts';


test('decide - match 0', numbers123Macro, decide(
  tokenAlterEvenness,
), 0, {
  matched: true,
  position: 2,
  value: 22,
});

test('decide - match 1', numbers123Macro, decide(
  tokenAlterEvenness,
), 1, {
  matched: true,
  position: 3,
  value: 33,
});

test('decide - nonmatch', numbers123Macro, decide(
  tokenSameEvenness,
), 0, { matched: false });

test('decide - not enough tokens', numbers123Macro, decide(
  tokenSameEvenness,
), 2, { matched: false });
