import test from 'ava';

import { tryParse } from './tryParse.ts';
import { concat } from '../char/concat.ts';
import { many } from '../core/many.ts';
import { charTest } from '../char/charTest.ts';
import { str } from '../char/str.ts';


test('tryParse - match', (t) => {
  t.deepEqual(
    tryParse(concat(many(charTest(/[a-m]/))), 'hello', {}),
    'hell',
  );
});

test('tryParse - nonmatch', (t) => {
  t.is(
    tryParse(str('bye'), 'hello', {}),
    undefined,
  );
});
