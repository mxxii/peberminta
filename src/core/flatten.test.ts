import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { flatten } from './flatten.ts';
import { all } from './all.ts';


test('flatten - match', numbers123Macro, flatten(
  tokenOdd,
  flatten(
    all(tokenEven),
    tokenOdd,
  ),
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('flatten - not enough tokens', numbers123Macro, flatten(
  tokenEven,
  flatten(
    all(tokenOdd),
    tokenEven,
  ),
), 1, { matched: false });

test('flatten - fail', numbers123Macro, flatten(
  tokenOdd,
  flatten(
    all(tokenEven),
    tokenEven,
  ),
), 0, { matched: false });

test('flatten - empty match', numbers123Macro, flatten(), 0, {
  matched: true,
  position: 0,
  value: [],
});
