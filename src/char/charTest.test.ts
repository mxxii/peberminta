import test from 'ava';

import { helloMacro } from '../../test/_testUtil.ts';

import { charTest } from './charTest.ts';


test('charTest - match with positive - character class', helloMacro, charTest(/[a-z]/), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('charTest - match with positive - unicode property', helloMacro, charTest(/\p{Letter}/u), 1, {
  matched: true,
  position: 2,
  value: 'e',
});

test('charTest - nonmatch with positive', helloMacro, charTest(/\P{Letter}/u), 1, { matched: false });

test('charTest - match with negative', helloMacro, charTest(undefined, /[aeiou]/), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('charTest - nonmatch with negative', helloMacro, charTest(undefined, /[aeiou]/), 1, { matched: false });

test('charTest - match with positive + negative', helloMacro, charTest(/\p{Letter}/u, /[aeiou]/), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('charTest - on end', helloMacro, charTest(/\p{Letter}/u), 5, { matched: false });

test('charTest - throws when neither condition is defined', (t) => {
  t.throws(
    () => charTest(undefined, undefined),
    { message: 'charTest: both positive and negative expressions are undefined' },
  );
});
