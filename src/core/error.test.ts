import test from 'ava';

import { data123 } from '../../test/_testUtil.ts';

import { error } from './error.ts';


test('error - string', (t) => {
  const parse = error(
    'No idea what just happened, deal with it!',
  );
  t.throws(
    () => parse(data123, 1),
    { message: 'No idea what just happened, deal with it!' },
  );
});

test('error - function', (t) => {
  const parse = error(
    (data, i) => `Errored at position ${i} (0-based) of ${data.tokens.length}`,
  );
  t.throws(
    () => parse(data123, 1),
    { message: 'Errored at position 1 (0-based) of 3' },
  );
});
