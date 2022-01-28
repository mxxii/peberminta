import test, {ExecutionContext} from 'ava';

import { Parser, Result, all, many } from '../src/core';
import {
  char, oneOf, anyOf, noneOf, charTest, str, concat,
  parserPosition, parse, tryParse, match
} from '../src/char';


const dataHello = { tokens: [...'hello'], options: {} };

const dataLorem = { tokens: ['Ĺ','o͂','ř','ȩ','m̅','🏳️‍🌈'], options: {} };

function helloMacro (
  t: ExecutionContext,
  p: Parser<string,unknown,unknown>,
  i: number,
  expected: Result<unknown>
) {
  t.deepEqual(p(dataHello, i), expected);
}

function loremMacro (
  t: ExecutionContext,
  p: Parser<string,unknown,unknown>,
  i: number,
  expected: Result<unknown>
) {
  t.deepEqual(p(dataLorem, i), expected);
}


test('char - match', helloMacro, char('h'), 0, {
  matched: true,
  position: 1,
  value: 'h'
});

test('char - match - combining', loremMacro, char('Ĺ'), 0, {
  matched: true,
  position: 1,
  value: 'Ĺ'
});

test('char - nonmatch', helloMacro, char('a'), 0, { matched: false });

test('char - on end', helloMacro, char('a'), 5, { matched: false });

test('oneOf - match - string', helloMacro, oneOf('fghi'), 0, {
  matched: true,
  position: 1,
  value: 'h'
});

test('oneOf - match - array', helloMacro, oneOf(['f', 'g', 'h', 'i']), 0, {
  matched: true,
  position: 1,
  value: 'h'
});

test('oneOf - match - combining', loremMacro, oneOf(['Ĺ', 'ȩ', 'm̅']), 0, {
  matched: true,
  position: 1,
  value: 'Ĺ'
});

test('oneOf - nonmatch - anyOf alias', helloMacro, anyOf('elopqrst'), 0, { matched: false });

test('oneOf - on end', helloMacro, oneOf(['a']), 5, { matched: false });

test('noneOf - match - string', helloMacro, noneOf('elopqrst'), 0, {
  matched: true,
  position: 1,
  value: 'h'
});

test('noneOf - match - array', helloMacro, noneOf(['e', 'l', 'o']), 0, {
  matched: true,
  position: 1,
  value: 'h'
});

test('noneOf - match - combining', loremMacro, noneOf(['Ĺ', 'ȩ', 'm̅']), 1, {
  matched: true,
  position: 2,
  value: 'o͂'
});

test('noneOf - nonmatch', helloMacro, noneOf('fghi'), 0, { matched: false });

test('noneOf - on end', helloMacro, noneOf(['a']), 5, { matched: false });

test('charTest - match - character class', helloMacro, charTest(/[a-z]/), 0, {
  matched: true,
  position: 1,
  value: 'h'
});

test('charTest - match - unicode property', helloMacro, charTest(/\p{Letter}/u), 1, {
  matched: true,
  position: 2,
  value: 'e'
});

test('charTest - nonmatch', helloMacro, charTest(/\P{Letter}/u), 1, { matched: false });

test('charTest - on end', helloMacro, charTest(/\p{Letter}/u), 5, { matched: false });

test('str - match', helloMacro, str('hell'), 0, {
  matched: true,
  position: 4,
  value: 'hell'
});

test('str - match - combining', loremMacro, str('Ĺo͂řȩ'), 0, {
  matched: true,
  position: 4,
  value: 'Ĺo͂řȩ'
});

test('str - nonmatch', helloMacro, str('help'), 0, { matched: false });

test('str - on end', helloMacro, str('world'), 5, { matched: false });

test('str - empty string matches without consuming input', helloMacro, str(''), 0, {
  matched: true,
  position: 0,
  value: ''
});

test('str - empty string matches on end', helloMacro, str(''), 5, {
  matched: true,
  position: 5,
  value: ''
});

test('concat - match', helloMacro, concat(
  char('h'),
  str(''),
  concat(
    char('e'),
    all(
      char('l'),
      char('l')
    )
  )
), 0, {
  matched: true,
  position: 4,
  value: 'hell'
});

test('concat - nonmatch', helloMacro, concat(
  char('h'),
  char('e'),
  char('l'),
  char('p')
), 0, { matched: false });

test('concat - empty match', helloMacro, concat(), 0, {
  matched: true,
  position: 0,
  value: ''
});

test('parserPosition - on token', t => {
  t.is(
    parserPosition(dataHello, 1, 1),
    ' 1\nhel...\n ^'
  );
});

test('parserPosition - on token - combining fallback', t => {
  t.is(
    parserPosition(dataLorem, 5, 1),
    '     ...\n 2   ř\n 3   ȩ\n 4   m̅\n 5 > 🏳️‍🌈'
  );
});

test('parserPosition - on end', t => {
  t.is(
    parserPosition(dataHello, 5, 1),
    '    5\n...o\n    ^'
  );
});

test('parserPosition - before start', t => {
  t.is(
    parserPosition(dataHello, -2, 1),
    '-2\n h...\n^'
  );
});

test('parse - match', t => {
  t.deepEqual(
    parse(str('hello'), 'hello', {}),
    'hello'
  );
});

test('parse - nonmatch', t => {
  t.throws(
    () => parse(str('bye'), 'hello', {}),
    { message: 'No match' }
  );
});

test('parse - partial', t => {
  t.throws(
    () => parse(str('hell'), ['h', 'e', 'l', 'l', 'o'], undefined),
    { message: 'Partial match. Parsing stopped at:\n    4\nhello\n    ^' }
  );
});

test('parse - partial - combining fallback', t => {
  t.throws(
    () => parse(str('Ĺo͂řȩm̅'), dataLorem.tokens, undefined),
    { message: 'Partial match. Parsing stopped at:\n     ...\n 2   ř\n 3   ȩ\n 4   m̅\n 5 > 🏳️‍🌈' }
  );
});

test('tryParse - match', t => {
  t.deepEqual(
    tryParse(concat(many(charTest(/[a-m]/))), 'hello', {}),
    'hell'
  );
});

test('tryParse - nonmatch', t => {
  t.is(
    tryParse(str('bye'), 'hello', {}),
    undefined
  );
});

test('match - match', t => {
  t.deepEqual(
    match(many(charTest(/\p{Number}/u)), 'hello', {}),
    []
  );
});
