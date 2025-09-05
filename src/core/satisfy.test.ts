import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { satisfy } from './satisfy.ts';
import { any } from './any.ts';


test('satisfy - match', numbers123Macro, satisfy(
  (x, data, i) => x + i === 23, // 22 + 1
), 1, {
  matched: true,
  position: 2,
  value: 22,
});

test('satisfy - nonmatch', numbers123Macro, satisfy(
  x => x === 12,
), 0, { matched: false });

test('satisfy - on end', numbers123Macro, any, 3, { matched: false });
