import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { chainReduce } from './chainReduce.ts';
import { map } from './map.ts';
import { any } from './any.ts';


test('chainReduce - match', numbers123Macro, chainReduce(
  '.',
  (acc, data, i) => map(any, v => `(${acc} * ${v},${i})`),
), 0, {
  matched: true,
  position: 3,
  value: '(((. * 11,0) * 22,1) * 33,2)',
});

test('chainReduce - empty match', numbers123Macro, chainReduce(
  '.',
  (acc, data, i) => map(any, v => `(${acc} * ${v},${i})`),
), 3, {
  matched: true,
  position: 3,
  value: '.',
});
