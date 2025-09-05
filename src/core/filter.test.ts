import test from 'ava';

import { numbers123Macro, tokenEven } from '../../test/_testUtil.ts';

import { filter } from './filter.ts';
import { guard, refine } from '../core.ts';

import { any } from './any.ts';


const anyNumberOrString = filter(any, (t: unknown): t is number | string => typeof t === 'number' || typeof t === 'string');
const anyNumber = guard(anyNumberOrString, (v): v is number => typeof v === 'number');
const gt15 = refine(anyNumber, v => v > 15);


test('filter - match', numbers123Macro, gt15, 1, {
  matched: true,
  position: 2,
  value: 22,
});

test('filter - nonmatch', numbers123Macro, gt15, 0, { matched: false });

test('filter - propagate inner nonmatch', numbers123Macro, filter(tokenEven, v => v > 0), 2, { matched: false });
