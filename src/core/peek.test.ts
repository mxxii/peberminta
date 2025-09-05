import test from 'ava';

import { data123, tokenEven, tokenOdd } from '../../test/_testUtil.ts';

import { peek } from './peek.ts';


test('peek match', (t) => {
  let externalVariable = 0;
  const parse = peek(
    tokenEven,
    (r, data, i) => externalVariable = data.tokens[i] + (r.matched ? r.value + r.position : -100),
  );
  const result = parse(data123, 1);
  t.is(externalVariable, 46); // 22 + 22 + 2
  t.deepEqual(result, {
    matched: true,
    position: 2,
    value: 22,
  });
});

test('peek nonmatch', (t) => {
  let externalVariable = 0;
  const parse = peek(
    tokenOdd,
    (r, data, i) => externalVariable = data.tokens[i] + (r.matched ? r.value + r.position : -100),
  );
  const result = parse(data123, 1);
  t.is(externalVariable, -78); // 22 - 100
  t.deepEqual(result, { matched: false });
});
