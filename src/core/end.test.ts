import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { end } from './end.ts';
import { eof } from '../core.ts';


test('end - match', numbers123Macro, end, 3, {
  matched: true,
  position: 3,
  value: true,
});

test('end - nonmatch', numbers123Macro, end, 0, { matched: false });

test('end - nonmatch - eof alias', numbers123Macro, eof, 0, { matched: false });
