import test from 'ava';

import { helloMacro, loremMacro } from '../../test/_testUtil.ts';

import { char } from './char.ts';


test('char - match', helloMacro, char('h'), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('char - match - combining', loremMacro, char('Ĺ'), 0, {
  matched: true,
  position: 1,
  value: 'Ĺ',
});

test('char - nonmatch', helloMacro, char('a'), 0, { matched: false });

test('char - on end', helloMacro, char('a'), 5, { matched: false });
