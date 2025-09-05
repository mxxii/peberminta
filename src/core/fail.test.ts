import test from 'ava';

import { numbers123Macro } from '../../test/_testUtil.ts';

import { fail } from './fail.ts';


test('fail - on token', numbers123Macro, fail, 0, { matched: false });

test('fail - on end', numbers123Macro, fail, 3, { matched: false });
