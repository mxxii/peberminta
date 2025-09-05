import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { takeWhile } from './takeWhile.ts';
import { any } from './any.ts';


test('takeWhile - limit by matched value', numbers123Macro, takeWhile(
  any,
  v => v < 30,
), 0, {
  matched: true,
  position: 2,
  value: [11, 22],
});

test('takeWhile - limit by number of matches', numbers123Macro, takeWhile(
  any,
  (v, n) => n < 2,
), 0, {
  matched: true,
  position: 1,
  value: [11],
});

test('takeWhile - limit by token value', numbers123Macro, takeWhile(
  any,
  (v, n, data, i) => data.tokens[i] % 2 !== 0,
), 0, {
  matched: true,
  position: 1,
  value: [11],
});

test('takeWhile - to the end', numbers123Macro, takeWhile(
  any,
  v => v < 99,
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

test('takeWhile - on end', numbers123Macro, takeWhile(
  any,
  v => v < 99,
), 3, {
  matched: true,
  position: 3,
  value: [],
});
