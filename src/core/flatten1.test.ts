import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import type { Parser } from '../coreTypes/Parser.ts';

import { flatten1 } from './flatten1.ts';
import { all } from './all.ts';


test('flatten1 - match', numbers123Macro, flatten1(all(
  tokenOdd,
  all(tokenEven, tokenOdd) as Parser<number, unknown, number | number[]>,
)), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33],
});
