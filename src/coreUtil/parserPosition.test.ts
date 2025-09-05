import test from 'ava';

import { data123 } from '../../test/_testUtil.js';

import { parserPosition } from './parserPosition.js';


test('parserPosition - on token', (t) => {
  t.is(
    parserPosition(data123, 1, t => String(t), 1),
    ' 0   11\n 1 > 22\n 2   33',
  );
});

test('parserPosition - on end', (t) => {
  t.is(
    parserPosition(data123, 3, t => String(t), 1),
    '     ...\n 2   33\n 3 >>',
  );
});

test('parserPosition - before start', (t) => {
  t.is(
    parserPosition(data123, -2, t => String(t), 1),
    '-2 >>\n 0   11\n     ...',
  );
});

test('parserPosition - after end', (t) => {
  t.is(
    parserPosition(data123, 5, t => String(t), 1),
    '     ...\n 2   33\n 5 >>',
  );
});
