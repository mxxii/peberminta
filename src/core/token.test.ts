import test from 'ava';

import { data123, numbers123Macro, tokenEvenR } from '../../test/_testUtil.js';

import { token } from './token.js';


test('token - on token - with value', numbers123Macro, tokenEvenR, 1, {
  matched: true,
  position: 2,
  value: {
    value: 22,
    data: { tokens: [11, 22, 33], options: {} },
    i: 1,
  },
});

test('token - on token - with undefined', numbers123Macro, tokenEvenR, 2, { matched: false });

test('token - on end', numbers123Macro, tokenEvenR, 3, { matched: false });

test('token - onEnd throw', (t) => {
  const parse = token(
    (t: number) => t * 2,
    () => { throw new Error('Required!'); },
  );
  t.deepEqual(
    parse(data123, 2),
    {
      matched: true,
      position: 3,
      value: 66,
    },
  );
  t.throws(
    () => parse(data123, 3),
    { message: 'Required!' },
  );
});
