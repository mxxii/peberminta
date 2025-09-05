import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { takeUntil } from './takeUntil.ts';
import { any } from './any.ts';


test('takeUntil - limit by matched value', numbers123Macro, takeUntil(
  any,
  v => v > 30,
), 0, {
  matched: true,
  position: 2,
  value: [11, 22],
});

test('takeUntil - limit by number of matches', numbers123Macro, takeUntil(
  any,
  (v, n) => n > 1,
), 0, {
  matched: true,
  position: 1,
  value: [11],
});

test('takeUntil - limit by token value', numbers123Macro, takeUntil(
  any,
  (v, n, data, i) => data.tokens[i] % 2 === 0,
), 0, {
  matched: true,
  position: 1,
  value: [11],
});
