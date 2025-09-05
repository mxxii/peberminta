import test from 'ava';

import { numbers123Macro, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { middle } from './middle.ts';
import { between } from '../core.ts';


test('middle - match', numbers123Macro, middle(
  tokenOdd,
  tokenEven,
  tokenOdd,
), 0, {
  matched: true,
  position: 3,
  value: 22,
});

test('middle - right fail', numbers123Macro, middle(
  tokenOdd,
  tokenEven,
  tokenEven,
), 0, { matched: false });

test('middle - right fail - between alias', numbers123Macro, between(
  tokenOdd,
  tokenEven,
  tokenEven,
), 0, { matched: false });
