import test from 'ava';

import { helloMacro } from '../../test/_testUtil.ts';

import { concat } from './concat.ts';
import { char } from './char.ts';
import { str } from './str.ts';
import { all } from '../core.ts';


test('concat - match', helloMacro, concat(
  char('h'),
  str(''),
  concat(
    char('e'),
    all(
      char('l'),
      char('l'),
    ),
  ),
), 0, {
  matched: true,
  position: 4,
  value: 'hell',
});

test('concat - nonmatch', helloMacro, concat(
  char('h'),
  char('e'),
  char('l'),
  char('p'),
), 0, { matched: false });

test('concat - empty match', helloMacro, concat(), 0, {
  matched: true,
  position: 0,
  value: '',
});
