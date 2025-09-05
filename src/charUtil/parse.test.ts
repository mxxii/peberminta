import test from 'ava';

import { dataLorem } from '../../test/_testUtil.ts';

import { parse } from './parse.ts';
import { str } from '../char/str.ts';


test('parse - match', (t) => {
  t.deepEqual(
    parse(str('hello'), 'hello', {}),
    'hello',
  );
});

test('parse - nonmatch', (t) => {
  t.throws(
    () => parse(str('bye'), 'hello', {}),
    { message: 'No match' },
  );
});

test('parse - partial', (t) => {
  t.throws(
    () => parse(str('hell'), ['h', 'e', 'l', 'l', 'o'], undefined),
    { message: 'Partial match. Parsing stopped at:\n    4\nhello\n    ^' },
  );
});

test('parse - partial - combining fallback', (t) => {
  t.throws(
    () => parse(str('Ĺo͂řȩm̅'), dataLorem.tokens, undefined),
    { message: 'Partial match. Parsing stopped at:\n     ...\n 2   ř\n 3   ȩ\n 4   m̅\n 5 > 🏳️‍🌈' },
  );
});
