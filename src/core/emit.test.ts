import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { emit } from './emit.ts';
import { of } from '../core.ts';


test('emit - value - on token', numbers123Macro, emit(42), 0, {
  matched: true,
  position: 0,
  value: 42,
});

test('emit - value object - on token - of alias', numbers123Macro, of({}), 0, {
  matched: true,
  position: 0,
  value: {},
});

test('emit - on end', numbers123Macro, emit(42), 3, {
  matched: true,
  position: 3,
  value: 42,
});
