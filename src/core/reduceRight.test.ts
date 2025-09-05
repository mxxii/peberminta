import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { reduceRight } from './reduceRight.ts';
import { any } from './any.ts';


test('reduceRight - match', numbers123Macro, reduceRight(
  any,
  '.',
  (x, acc, data, i, j) => `(${x},${i},${j} * ${acc})`,
), 0, {
  matched: true,
  position: 3,
  value: '(11,0,3 * (22,0,3 * (33,0,3 * .)))',
});

test('reduceRight - empty match', numbers123Macro, reduceRight(
  any,
  '.',
  (x, acc, data, i, j) => `(${x},${i},${j} * ${acc})`,
), 3, {
  matched: true,
  position: 3,
  value: '.',
});
