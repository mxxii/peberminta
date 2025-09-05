import test from 'ava';

import { data123 } from '../../test/_testUtil.js';

import { remainingTokensNumber } from './remainingTokensNumber.js';


test('remainingTokensNumber', (t) => {
  t.is(
    remainingTokensNumber(data123, 1),
    2,
  );
  t.is(
    remainingTokensNumber(data123, 3),
    0,
  );
  t.is(
    remainingTokensNumber(data123, 4),
    -1,
  );
});
