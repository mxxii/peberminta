import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { map } from './map.ts';
import { any } from './any.ts';


test('map - on token', numbers123Macro, map(
  any,
  (x, data, i, j) => x + data.tokens[i] + j,
), 1, {
  matched: true,
  position: 2,
  value: 46, // 22 + 22 + 2
});

test('map - on end', numbers123Macro, map(
  any,
  x => 3 * x + 1,
), 3, { matched: false });
