import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { abc } from './abc.ts';


test('abc - match', numbers123Macro, abc(
  tokenOdd,
  tokenEven,
  tokenOdd,
  (v1, v2, v3, data, i, j) => [v1, v2, v3, i, j],
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33, 0, 3],
});

test('abc - not enough tokens', numbers123Macro, abc(
  tokenEven,
  tokenOdd,
  tokenEven,
  (v1, v2, v3) => [v1, v2, v3],
), 1, { matched: false });

test('abc - right fail', numbers123Macro, abc(
  tokenOdd,
  tokenEven,
  tokenEven,
  (v1, v2, v3) => [v1, v2, v3],
), 0, { matched: false });
