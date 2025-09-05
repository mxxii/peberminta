import test from 'ava';

import { numbers123Macro, tokenEven } from '../../test/_testUtil.ts';

import { option } from './option.ts';


test('option match - on token', numbers123Macro, option(
  tokenEven,
  99,
), 1, {
  matched: true,
  position: 2,
  value: 22,
});

test('option nonmatch - on end', numbers123Macro, option(
  tokenEven,
  99,
), 0, {
  matched: true,
  position: 0,
  value: 99,
});

test('option - on end', numbers123Macro, option(
  tokenEven,
  99,
), 3, {
  matched: true,
  position: 3,
  value: 99,
});
