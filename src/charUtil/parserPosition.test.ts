import test from 'ava';

import { dataHello, dataLorem } from '../../test/_testUtil.ts';

import { parserPosition } from './parserPosition.ts';


test('parserPosition - on token', (t) => {
  t.is(
    parserPosition(dataHello, 1, 1),
    ' 1\nhel...\n ^',
  );
});

test('parserPosition - on token - combining fallback', (t) => {
  t.is(
    parserPosition(dataLorem, 5, 1),
    '     ...\n 2   ř\n 3   ȩ\n 4   m̅\n 5 > 🏳️‍🌈',
  );
});

test('parserPosition - on end', (t) => {
  t.is(
    parserPosition(dataHello, 5, 1),
    '    5\n...o\n    ^',
  );
});

test('parserPosition - before start', (t) => {
  t.is(
    parserPosition(dataHello, -2, 1),
    '-2\n h...\n^',
  );
});
