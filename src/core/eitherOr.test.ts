import test from 'ava';

import { numbers123Macro, tokenOdd } from '../../test/_testUtil.ts';

import { eitherOr } from './eitherOr.ts';
import { emit } from './emit.ts';
import { map } from './map.ts';
import { otherwise } from '../core.ts';


test('eitherOr - parser match', numbers123Macro, eitherOr(
  tokenOdd,
  emit(99),
), 0, {
  matched: true,
  position: 1,
  value: 11,
});

test('eitherOr - parser nonmatch', numbers123Macro, eitherOr(
  tokenOdd,
  emit(99),
), 1, {
  matched: true,
  position: 1,
  value: 99,
});

test('eitherOr - on end', numbers123Macro, eitherOr(
  tokenOdd,
  emit(99),
), 3, {
  matched: true,
  position: 3,
  value: 99,
});

test('eitherOr - different types - otherwise alias', numbers123Macro, otherwise(
  tokenOdd,
  emit('a string'),
), 1, {
  matched: true,
  position: 1,
  value: 'a string' as const,
});

test('eitherOr - two parsers nonmatch - otherwise alias', numbers123Macro, otherwise(
  tokenOdd,
  map(tokenOdd, v => String(v)),
), 1, { matched: false });
