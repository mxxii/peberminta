import test from 'ava';

import { data123, tokenEven, tokenOdd } from '../../test/_testUtil.js';

import { parse } from './parse.js';
import { many } from '../core/many.js';
import { any } from '../core/any.js';


test('parse - match', (t) => {
  t.deepEqual(
    parse(many(any), data123.tokens, {}),
    [11, 22, 33],
  );
});

test('parse - nonmatch', (t) => {
  t.throws(
    () => parse(tokenEven, data123.tokens, {}),
    { message: 'No match' },
  );
});

test('parse - partial', (t) => {
  t.throws(
    () => parse(tokenOdd, data123.tokens, {}),
    { message: 'Partial match. Parsing stopped at:\n 0   11\n 1 > 22\n 2   33' },
  );
});
