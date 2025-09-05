import test from 'ava';

import { numbers123Macro, tokenEvenR } from '../../test/_testUtil.ts';

import { mapR } from './mapR.ts';


test('mapR match - on token', numbers123Macro, mapR(
  tokenEvenR,
  (x, data, i) => ({ ...x, value: { foo: data.tokens[i], bar: x.value } }),
), 1, {
  matched: true,
  position: 2,
  value: { foo: 22, bar: {
    value: 22,
    data: { tokens: [11, 22, 33], options: {} },
    i: 1,
  } },
});

test('mapR nonmatch - on token', numbers123Macro, mapR(
  tokenEvenR,
  () => ({ matched: false }),
), 1, { matched: false });

test('mapR match - on end', numbers123Macro, mapR(
  tokenEvenR,
  x => ({ ...x, foo: true }),
), 3, { matched: false });
