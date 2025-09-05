import test from 'ava';

import { helloMacro, loremMacro } from '../../test/_testUtil.ts';

import { noneOf } from './noneOf.ts';


test('noneOf - match - string', helloMacro, noneOf('elopqrst'), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('noneOf - match - array', helloMacro, noneOf(['e', 'l', 'o']), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('noneOf - match - combining', loremMacro, noneOf(['Ĺ', 'ȩ', 'm̅']), 1, {
  matched: true,
  position: 2,
  value: 'o͂',
});

test('noneOf - nonmatch', helloMacro, noneOf('fghi'), 0, { matched: false });

test('noneOf - on end', helloMacro, noneOf(['a']), 5, { matched: false });
