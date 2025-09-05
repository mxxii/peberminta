import test from 'ava';

import { data123 } from '../../test/_testUtil.js';

import { match } from './match.js';
import { many } from '../core/many.js';
import { any } from '../core/any.js';


test('match - match', (t) => {
  t.deepEqual(
    match(many(any), data123.tokens, {}),
    [11, 22, 33],
  );
});
