import test from 'ava';

import { data123 } from '../../test/_testUtil.ts';

import type { Matcher } from '../coreTypes/Matcher.ts';

import { action } from './action.ts';


test('action', (t) => {
  let externalVariable = 0;
  const parse: Matcher<number, unknown, null> = action((data, i) => {
    externalVariable = data.tokens[i] + i;
  });
  const result = parse(data123, 2);
  t.is(externalVariable, 35); // 33 + 2
  t.deepEqual(result, {
    matched: true,
    position: 2,
    value: null,
  });
});
