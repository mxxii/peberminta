import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { reduceLeft } from './reduceLeft.ts';
import { any } from './any.ts';


test('reduceLeft - match', numbers123Macro, reduceLeft(
  '.',
  any,
  (acc, x, data, i, j) => `(${acc} * ${x},${i},${j})`,
), 0, {
  matched: true,
  position: 3,
  value: '(((. * 11,0,1) * 22,1,2) * 33,2,3)',
});

test('reduceLeft - empty match', numbers123Macro, reduceLeft(
  '.',
  any,
  (acc, x, data, i, j) => `(${acc} * ${x},${i},${j})`,
), 3, {
  matched: true,
  position: 3,
  value: '.',
});
