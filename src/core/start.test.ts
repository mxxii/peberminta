import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { start } from './start.ts';


test('start - match', numbers123Macro, start, 0, {
  matched: true,
  position: 0,
  value: true,
});

test('start - nonmatch', numbers123Macro, start, 3, { matched: false });
