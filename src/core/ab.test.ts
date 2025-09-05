import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { ab } from './ab.ts';


test('ab - match', numbers123Macro, ab(
  tokenOdd,
  tokenEven,
  (v1, v2, data, i, j) => [v1, v2, data.tokens[i], data.tokens[j]],
), 0, {
  matched: true,
  position: 2,
  value: [11, 22, 11, 33],
});

test('ab - left fail', numbers123Macro, ab(
  tokenEven,
  tokenEven,
  (v1, v2) => [v1, v2],
), 0, { matched: false });

test('ab - right fail', numbers123Macro, ab(
  tokenEven,
  tokenEven,
  (v1, v2) => [v1, v2],
), 1, { matched: false });

test('ab - not enough tokens', numbers123Macro, ab(
  tokenOdd,
  tokenOdd,
  (v1, v2) => [v1, v2],
), 2, { matched: false });
