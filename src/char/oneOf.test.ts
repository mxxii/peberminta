import test from 'ava';

import { helloMacro, loremMacro } from '../../test/_testUtil.ts';

import { oneOf } from './oneOf.ts';
import { anyOf } from '../char.ts';


test('oneOf - match - string', helloMacro, oneOf('fghi'), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('oneOf - match - array', helloMacro, oneOf(['f', 'g', 'h', 'i']), 0, {
  matched: true,
  position: 1,
  value: 'h',
});

test('oneOf - match - combining', loremMacro, oneOf(['Ĺ', 'ȩ', 'm̅']), 0, {
  matched: true,
  position: 1,
  value: 'Ĺ',
});

test('oneOf - nonmatch - anyOf alias', helloMacro, anyOf('elopqrst'), 0, { matched: false });

test('oneOf - on end', helloMacro, oneOf(['a']), 5, { matched: false });
