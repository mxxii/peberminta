import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { make } from './make.ts';


test('make - on token', numbers123Macro, make((data, i) => data.tokens[i] + i), 1, {
  matched: true,
  position: 1,
  value: 23, // 22 + 1
});

test('make - on end', numbers123Macro, make((data, i) => i), 3, {
  matched: true,
  position: 3,
  value: 3,
});
