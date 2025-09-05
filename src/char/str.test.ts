import test from 'ava';

import { helloMacro, loremMacro } from '../../test/_testUtil.ts';

import { str } from './str.ts';


test('str - match', helloMacro, str('hell'), 0, {
  matched: true,
  position: 4,
  value: 'hell',
});

test('str - match - combining', loremMacro, str('Ĺo͂řȩ'), 0, {
  matched: true,
  position: 4,
  value: 'Ĺo͂řȩ',
});

test('str - nonmatch', helloMacro, str('help'), 0, { matched: false });

test('str - on end', helloMacro, str('world'), 5, { matched: false });

test('str - empty string matches without consuming input', helloMacro, str(''), 0, {
  matched: true,
  position: 0,
  value: '',
});

test('str - empty string matches on end', helloMacro, str(''), 5, {
  matched: true,
  position: 5,
  value: '',
});
