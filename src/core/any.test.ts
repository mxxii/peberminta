import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { any } from './any.ts';


test('any - on token', numbers123Macro, any, 0, {
  matched: true,
  position: 1,
  value: 11,
});

test('any - on end', numbers123Macro, any, 3, { matched: false });
