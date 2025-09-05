import test from 'ava';

import { data123, tokenEven } from '../../test/_testUtil.js';

import { tryParse } from './tryParse.js';
import { many } from '../core/many.js';
import { any } from '../core/any.js';


test('tryParse - match', (t) => {
  t.deepEqual(
    tryParse(many(any), data123.tokens, {}),
    [11, 22, 33],
  );
});

test('tryParse - nonmatch', (t) => {
  t.is(
    tryParse(tokenEven, data123.tokens, {}),
    undefined,
  );
});
