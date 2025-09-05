import test from 'ava';
import { match } from './match.ts';
import { many } from '../core/many.ts';
import { charTest } from '../char/charTest.ts';


test('match - match', (t) => {
  t.deepEqual(
    match(many(charTest(/\p{Number}/u)), 'hello', {}),
    [],
  );
});
