import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import type { Parser } from '../coreTypes/Parser.ts';
import type { Data } from '../coreTypes/Data.ts';
import type { Result } from '../coreTypes/Result.ts';

import { recursive } from './recursive.ts';
import { flatten } from './flatten.ts';
import { any } from './any.ts';
import { eitherOr } from './eitherOr.ts';
import { emit } from './emit.ts';


const recParser: Parser<number, unknown, number[]> = flatten(
  any,
  eitherOr(
    recursive(() => recParser),
    emit([] as number[]),
  ),
);

test('recursive - match', numbers123Macro, recParser, 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});

function recParser2 (data: Data<number, unknown>, i: number): Result<number[]> {
  return flatten(
    any as Parser<number, unknown, number | number[]>,
    eitherOr(
      recParser2,
      emit([] as number[]),
    ),
  )(data, i);
}

test('recursive - no need for functions', numbers123Macro, recParser2, 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});
