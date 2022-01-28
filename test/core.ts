import test, {ExecutionContext} from 'ava';

import {
  Parser, Matcher, Data, Result,
  emit, of, make, action, fail, error, token, any, satisfy,
  map, map1, peek, option, not, choice, or, otherwise, longest,
  takeWhile, takeUntil, takeWhileP, takeUntilP, many, many1, some,
  ab, left, right, abc, middle, all, and, skip, discard, flatten,
  flatten1, sepBy1, sepBy, chainReduce, reduceLeft, reduceRight,
  leftAssoc1, rightAssoc1, leftAssoc2, rightAssoc2, condition,
  decide, chain, ahead, lookAhead, recursive, start, end,
  remainingTokensNumber, parserPosition, parse, tryParse, match
} from '../src/core';


const data123 = { tokens: [11,22,33], options: {} };

function numbers123Macro(
  t: ExecutionContext,
  p: Parser<number,unknown,unknown>,
  i: number,
  expected: Result<unknown>
) {
  t.deepEqual(p(data123, i), expected);
}

const tokenNegative = token(
  (t: number) => (t < 0)
    ? t
    : undefined
);

const tokenOdd = token(
  (t: number) => (t % 2 === 0)
    ? undefined
    : t
);

const tokenEven = token(
  (t: number) => (t % 2 === 0)
    ? t
    : undefined
);

const tokenEven1 = token(
  (t: number, data, i) => (t % 2 === 0)
    ? {
      value: t,
      data: data,
      i: i
    }
    : undefined
);

const tokenAlterEvenness = token(
  (t: number) => (t % 2 === 0)
    ? tokenOdd
    : tokenEven
);

const tokenSameEvenness = token(
  (t: number) => (t % 2 === 0)
    ? tokenEven
    : tokenOdd
);

const tokenAddX = token(
  (t: number) => (x: number) => x + t
);

const tokenBinaryOp = token(
  (t: number) => (x: number, y: number) => x * t + y
);


test('emit - value - on token', numbers123Macro, emit(42), 0, {
  matched: true,
  position: 0,
  value: 42
});

test('emit - value object - on token - of alias', numbers123Macro, of({}), 0, {
  matched: true,
  position: 0,
  value: {}
});

test('emit - on end', numbers123Macro, emit(42), 3, {
  matched: true,
  position: 3,
  value: 42
});


test('make - on token', numbers123Macro, make((data, i) => data.tokens[i] + i), 1, {
  matched: true,
  position: 1,
  value: 23 // 22 + 1
});

test('make - on end', numbers123Macro, make((data, i) => i), 3, {
  matched: true,
  position: 3,
  value: 3
});

test('action', t => {
  let externalVariable = 0;
  const parse: Matcher<number,unknown,null> = action((data, i) => {
    externalVariable = data.tokens[i] + i;
  });
  const result = parse(data123, 2);
  t.is(externalVariable, 35); // 33 + 2
  t.deepEqual(result, {
    matched: true,
    position: 2,
    value: null
  });
});

test('fail - on token', numbers123Macro, fail, 0, { matched: false });
test('fail - on end', numbers123Macro, fail, 3, { matched: false });

test('error - string', t => {
  const parse = error(
    'No idea what just happened, deal with it!'
  );
  t.throws(
    () => parse(data123, 1),
    { message: 'No idea what just happened, deal with it!' }
  );
});

test('error - function', t => {
  const parse = error(
    (data, i) => `Errored at position ${i} (0-based) of ${data.tokens.length}`
  );
  t.throws(
    () => parse(data123, 1),
    { message: 'Errored at position 1 (0-based) of 3' }
  );
});

test('token - on token - with value', numbers123Macro, tokenEven1, 1, {
  matched: true,
  position: 2,
  value: {
    value: 22,
    data: { tokens: [11,22,33], options: {} },
    i: 1
  }
});

test('token - on token - with undefined', numbers123Macro, tokenEven1, 2, { matched: false });

test('token - on end', numbers123Macro, tokenEven1, 3, { matched: false });

test('token - onEnd throw', t => {
  const parse = token(
    (t: number) => t * 2,
    () => { throw new Error('Required!'); }
  );
  t.deepEqual(
    parse(data123, 2),
    {
      matched: true,
      position: 3,
      value: 66
    }
  );
  t.throws(
    () => parse(data123, 3),
    { message: 'Required!' }
  );
});

test('any - on token', numbers123Macro, any, 0, {
  matched: true,
  position: 1,
  value: 11
});

test('any - on end', numbers123Macro, any, 3, { matched: false });

test('satisfy - match', numbers123Macro, satisfy(
  (x, data, i) => x + i === 23 // 22 + 1
), 1, {
  matched: true,
  position: 2,
  value: 22
});

test('satisfy - nonmatch', numbers123Macro, satisfy(
  (x) => x === 12
), 0, { matched: false });

test('satisfy - on end', numbers123Macro, any, 3, { matched: false });

test('map - on token', numbers123Macro, map(
  any,
  (x, data, i, j) => x + data.tokens[i] + j
), 1, {
  matched: true,
  position: 2,
  value: 46 // 22 + 22 + 2
});

test('map - on end', numbers123Macro, map(
  any,
  (x) => 3 * x + 1
), 3, { matched: false });

test('map1 match - on token', numbers123Macro, map1(
  tokenEven1,
  (x, data, i) => ({ ...x, value: { foo: data.tokens[i], bar: x.value } })
), 1, {
  matched: true,
  position: 2,
  value: { foo: 22, bar: {
    value: 22,
    data: { tokens: [11,22,33], options: {} },
    i: 1
  } }
});

test('map1 nonmatch - on token', numbers123Macro, map1(
  tokenEven1,
  () => ({ matched: false })
), 1, { matched: false });

test('map1 match - on end', numbers123Macro, map1(
  tokenEven1,
  (x) => ({ ...x, foo: true })
), 3, { matched: false });

test('peek match', t => {
  let externalVariable = 0;
  const parse = peek(
    tokenEven,
    (r, data, i) => externalVariable = data.tokens[i] + (r.matched ? r.value + r.position : -100)
  );
  const result = parse(data123, 1);
  t.is(externalVariable, 46); // 22 + 22 + 2
  t.deepEqual(result, {
    matched: true,
    position: 2,
    value: 22
  });
});

test('peek nonmatch', t => {
  let externalVariable = 0;
  const parse = peek(
    tokenOdd,
    (r, data, i) => externalVariable = data.tokens[i] + (r.matched ? r.value + r.position : -100)
  );
  const result = parse(data123, 1);
  t.is(externalVariable, -78); // 22 - 100
  t.deepEqual(result, { matched: false });
});

test('option match - on token', numbers123Macro, option(
  tokenEven,
  99
), 1, {
  matched: true,
  position: 2,
  value: 22
});

test('option nonmatch - on end', numbers123Macro, option(
  tokenEven,
  99
), 0, {
  matched: true,
  position: 0,
  value: 99
});

test('option - on end', numbers123Macro, option(
  tokenEven,
  99
), 3, {
  matched: true,
  position: 3,
  value: 99
});

test('not - match', numbers123Macro, not(
  tokenEven
), 0, {
  matched: true,
  position: 0,
  value: true
});

test('not - nonmatch', numbers123Macro, not(
  tokenEven
), 1, { matched: false });

test('choice - match 0', numbers123Macro, choice(
  tokenOdd,
  tokenEven
), 0, {
  matched: true,
  position: 1,
  value: 11
});

test('choice - match 1 - or alias', numbers123Macro, or(
  tokenOdd,
  tokenEven
), 1, {
  matched: true,
  position: 2,
  value: 22
});

test('choice nonmatch', numbers123Macro, choice(
  tokenOdd,
  tokenNegative
), 1, { matched: false });

test('choice - on end', numbers123Macro, choice(
  tokenOdd,
  tokenEven
), 3, { matched: false });

test('choice - empty', numbers123Macro, choice(), 0, { matched: false });

test('otherwise - parser match', numbers123Macro, otherwise(
  tokenOdd,
  emit(99)
), 0, {
  matched: true,
  position: 1,
  value: 11
});

test('otherwise - parser nonmatch', numbers123Macro, otherwise(
  tokenOdd,
  emit(99)
), 1, {
  matched: true,
  position: 1,
  value: 99
});

test('otherwise - on end', numbers123Macro, otherwise(
  tokenOdd,
  emit(99)
), 3, {
  matched: true,
  position: 3,
  value: 99
});

test('longest - empty', numbers123Macro, longest(), 0, { matched: false });

test('longest - take longest', numbers123Macro, longest(
  tokenOdd,
  middle(tokenOdd, emit(99), tokenEven)
), 0, {
  matched: true,
  position: 2,
  value: 99
});

test('longest - take first of equal length', numbers123Macro, longest(
  tokenOdd,
  right(tokenOdd, emit(99))
), 0, {
  matched: true,
  position: 1,
  value: 11
});

test('takeWhile - limit by matched value', numbers123Macro, takeWhile(
  any,
  (v) => v < 30
), 0, {
  matched: true,
  position: 2,
  value: [11, 22]
});

test('takeWhile - limit by number of matches', numbers123Macro, takeWhile(
  any,
  (v, n) => n < 2
), 0, {
  matched: true,
  position: 1,
  value: [11]
});

test('takeWhile - limit by token value', numbers123Macro, takeWhile(
  any,
  (v, n, data, i) => data.tokens[i] % 2 !== 0
), 0, {
  matched: true,
  position: 1,
  value: [11]
});

test('takeWhile - to the end', numbers123Macro, takeWhile(
  any,
  (v) => v < 99
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

test('takeWhile - on end', numbers123Macro, takeWhile(
  any,
  (v) => v < 99
), 3, {
  matched: true,
  position: 3,
  value: []
});

test('takeUntil - limit by matched value', numbers123Macro, takeUntil(
  any,
  (v) => v > 30
), 0, {
  matched: true,
  position: 2,
  value: [11, 22]
});

test('takeUntil - limit by number of matches', numbers123Macro, takeUntil(
  any,
  (v, n) => n > 1
), 0, {
  matched: true,
  position: 1,
  value: [11]
});

test('takeUntil - limit by token value', numbers123Macro, takeUntil(
  any,
  (v, n, data, i) => data.tokens[i] % 2 === 0
), 0, {
  matched: true,
  position: 1,
  value: [11]
});

test('takeWhileP', numbers123Macro, takeWhileP(
  any,
  tokenOdd
), 0, {
  matched: true,
  position: 1,
  value: [11]
});

test('takeUntilP', numbers123Macro, takeUntilP(
  any,
  tokenOdd
), 1, {
  matched: true,
  position: 2,
  value: [22]
});

test('many - to the end', numbers123Macro, many(
  any
), 1, {
  matched: true,
  position: 3,
  value: [22, 33]
});

test('many - no match', numbers123Macro, many(
  tokenOdd
), 1, {
  matched: true,
  position: 1,
  value: []
});

test('many1 - to the end', numbers123Macro, many1(
  any
), 1, {
  matched: true,
  position: 3,
  value: [22, 33]
});

test('many1 - on end - some alias', numbers123Macro, some(
  any
), 3, { matched: false });

test('many1 - no match', numbers123Macro, many1(
  tokenOdd
), 1, { matched: false });

test('ab - match', numbers123Macro, ab(
  tokenOdd,
  tokenEven,
  (v1, v2, data, i, j) => [v1, v2, data.tokens[i], data.tokens[j]]
), 0, {
  matched: true,
  position: 2,
  value: [11, 22, 11, 33]
});

test('ab - left fail', numbers123Macro, ab(
  tokenEven,
  tokenEven,
  (v1, v2) => [v1, v2]
), 0, { matched: false });

test('ab - right fail', numbers123Macro, ab(
  tokenEven,
  tokenEven,
  (v1, v2) => [v1, v2]
), 1, { matched: false });

test('ab - not enough tokens', numbers123Macro, ab(
  tokenOdd,
  tokenOdd,
  (v1, v2) => [v1, v2]
), 2, { matched: false });

test('left - match', numbers123Macro, left(
  tokenOdd,
  tokenEven
), 0, {
  matched: true,
  position: 2,
  value: 11
});

test('left - right fail', numbers123Macro, left(
  tokenEven,
  tokenEven
), 1, { matched: false });

test('right - match', numbers123Macro, right(
  tokenOdd,
  tokenEven
), 0, {
  matched: true,
  position: 2,
  value: 22
});

test('right - left fail', numbers123Macro, right(
  tokenEven,
  tokenEven
), 0, { matched: false });

test('abc - match', numbers123Macro, abc(
  tokenOdd,
  tokenEven,
  tokenOdd,
  (v1, v2, v3, data, i, j) => [v1, v2, v3, i, j]
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33, 0, 3]
});

test('abc - not enough tokens', numbers123Macro, abc(
  tokenEven,
  tokenOdd,
  tokenEven,
  (v1, v2, v3) => [v1, v2, v3]
), 1, { matched: false });

test('abc - right fail', numbers123Macro, abc(
  tokenOdd,
  tokenEven,
  tokenEven,
  (v1, v2, v3) => [v1, v2, v3]
), 0, { matched: false });

test('middle - match', numbers123Macro, middle(
  tokenOdd,
  tokenEven,
  tokenOdd
), 0, {
  matched: true,
  position: 3,
  value: 22
});

test('middle - right fail', numbers123Macro, middle(
  tokenOdd,
  tokenEven,
  tokenEven
), 0, { matched: false });

test('all - match', numbers123Macro, all(
  tokenOdd,
  tokenEven,
  tokenOdd
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

test('all - not enough tokens', numbers123Macro, all(
  tokenEven,
  tokenOdd,
  tokenEven
), 1, { matched: false });

test('all - one fail - and alias', numbers123Macro, and(
  tokenEven,
  tokenEven,
  tokenEven
), 0, { matched: false });

test('all - empty match', numbers123Macro, all(), 0, {
  matched: true,
  position: 0,
  value: []
});

test('skip - match', numbers123Macro, skip(
  tokenOdd,
  tokenEven,
  tokenOdd
), 0, {
  matched: true,
  position: 3,
  value: null
});

test('skip - not enough tokens', numbers123Macro, skip(
  tokenEven,
  tokenOdd,
  tokenEven
), 1, { matched: false });

test('skip - one fail - discard alias', numbers123Macro, discard(
  tokenEven,
  tokenEven,
  tokenEven
), 0, { matched: false });

test('skip - empty match', numbers123Macro, skip(), 0, {
  matched: true,
  position: 0,
  value: null
});

test('flatten - match', numbers123Macro, flatten(
  tokenOdd,
  flatten(
    all(tokenEven),
    tokenOdd
  )
), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

test('flatten - not enough tokens', numbers123Macro, flatten(
  tokenEven,
  flatten(
    all(tokenOdd),
    tokenEven
  )
), 1, { matched: false });

test('flatten - fail', numbers123Macro, flatten(
  tokenOdd,
  flatten(
    all(tokenEven),
    tokenEven
  )
), 0, { matched: false });

test('flatten - empty match', numbers123Macro, flatten(), 0, {
  matched: true,
  position: 0,
  value: []
});

test('flatten1 - match', numbers123Macro, flatten1(all(
  tokenOdd,
  all(tokenEven, tokenOdd) as Parser<number, unknown, number|number[]>
)), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

test('sepBy1 - match 0', numbers123Macro, sepBy1(
  tokenOdd,
  tokenEven
), 0, {
  matched: true,
  position: 3,
  value: [11, 33]
});

test('sepBy1 - match 2', numbers123Macro, sepBy1(
  tokenOdd,
  tokenEven
), 2, {
  matched: true,
  position: 3,
  value: [33]
});

test('sepBy1 - dangling separator not consumed', numbers123Macro, sepBy1(
  tokenEven,
  tokenOdd
), 1, {
  matched: true,
  position: 2,
  value: [22]
});

test('sepBy1 - nonmatch', numbers123Macro, sepBy1(
  tokenEven,
  tokenOdd
), 0, { matched: false });

test('sepBy - match 0', numbers123Macro, sepBy(
  tokenOdd,
  tokenEven
), 0, {
  matched: true,
  position: 3,
  value: [11, 33]
});

test('sepBy - dangling separator not consumed', numbers123Macro, sepBy(
  tokenEven,
  tokenOdd
), 1, {
  matched: true,
  position: 2,
  value: [22]
});

test('sepBy - empty match', numbers123Macro, sepBy(
  tokenEven,
  tokenOdd
), 0, {
  matched: true,
  position: 0,
  value: []
});

test('chainReduce - match', numbers123Macro, chainReduce(
  '.',
  (acc, data, i) => map(any, (v) => `(${acc} * ${v},${i})`)
), 0, {
  matched: true,
  position: 3,
  value: '(((. * 11,0) * 22,1) * 33,2)'
});

test('chainReduce - empty match', numbers123Macro, chainReduce(
  '.',
  (acc, data, i) => map(any, (v) => `(${acc} * ${v},${i})`)
), 3, {
  matched: true,
  position: 3,
  value: '.'
});

test('reduceLeft - match', numbers123Macro, reduceLeft(
  '.',
  any,
  (acc, x, data, i, j) => `(${acc} * ${x},${i},${j})`
), 0, {
  matched: true,
  position: 3,
  value: '(((. * 11,0,1) * 22,1,2) * 33,2,3)'
});

test('reduceLeft - empty match', numbers123Macro, reduceLeft(
  '.',
  any,
  (acc, x, data, i, j) => `(${acc} * ${x},${i},${j})`
), 3, {
  matched: true,
  position: 3,
  value: '.'
});

test('reduceRight - match', numbers123Macro, reduceRight(
  any,
  '.',
  (x, acc, data, i, j) => `(${x},${i},${j} * ${acc})`
), 0, {
  matched: true,
  position: 3,
  value: '(11,0,3 * (22,0,3 * (33,0,3 * .)))'
});

test('reduceRight - empty match', numbers123Macro, reduceRight(
  any,
  '.',
  (x, acc, data, i, j) => `(${x},${i},${j} * ${acc})`
), 3, {
  matched: true,
  position: 3,
  value: '.'
});

test('leftAssoc1 - match', numbers123Macro, leftAssoc1(
  any,
  tokenAddX
), 0, {
  matched: true,
  position: 3,
  value: 66
});

test('leftAssoc1 - nonmatch', numbers123Macro, leftAssoc1(
  tokenEven,
  tokenAddX
), 0, { matched: false });

test('rightAssoc1 - match', numbers123Macro, rightAssoc1(
  tokenAddX,
  emit(100),
), 0, {
  matched: true,
  position: 3,
  value: 166
});

test('rightAssoc1 - nonmatch', numbers123Macro, rightAssoc1(
  tokenAddX,
  tokenEven,
), 0, { matched: false });

test('leftAssoc2 - match 0', numbers123Macro, leftAssoc2(
  any,
  emit((x: number,y: number) => x * 2 + y),
  any
), 0, {
  matched: true,
  position: 3,
  value: 121 // ((11 * 2 + 22) * 2 + 33)
});

test('leftAssoc2 - match 1', numbers123Macro, leftAssoc2(
  any,
  tokenBinaryOp,
  any
), 1, {
  matched: true,
  position: 2,
  value: 22
});

test('leftAssoc2 - match 2', numbers123Macro, leftAssoc2(
  any,
  tokenBinaryOp,
  any
), 2, {
  matched: true,
  position: 3,
  value: 33
});

test('leftAssoc2 - nonmatch', numbers123Macro, leftAssoc2(
  tokenEven,
  tokenBinaryOp,
  any
), 0, { matched: false });

test('rightAssoc2 - match 0', numbers123Macro, rightAssoc2(
  left(any, ahead(any)),
  emit((x: number,y: number) => x * 2 + y),
  any
), 0, {
  matched: true,
  position: 3,
  value: 99 // (11 * 2 + (22 * 2 + (33)))
});

test('rightAssoc2 - nonmatch 1', numbers123Macro, rightAssoc2(
  any,
  tokenBinaryOp,
  any
), 1, { matched: false });

test('rightAssoc2 - match 2', numbers123Macro, rightAssoc2(
  any,
  tokenBinaryOp,
  any
), 2, {
  matched: true,
  position: 3,
  value: 33
});

test('rightAssoc2 - match - only right', numbers123Macro, rightAssoc2(
  tokenEven,
  tokenBinaryOp,
  any
), 0, {
  matched: true,
  position: 1,
  value: 11
});

test('condition - match', numbers123Macro, many(condition(
  (data, i) => i % 2 === 0,
  tokenOdd,
  tokenEven
)), 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

test('condition - stop by condition', numbers123Macro, many(condition(
  (data, i) => i < 2,
  any,
  fail
)), 0, {
  matched: true,
  position: 2,
  value: [11, 22]
});

test('decide - match 0', numbers123Macro, decide(
  tokenAlterEvenness
), 0, {
  matched: true,
  position: 2,
  value: 22
});

test('decide - match 1', numbers123Macro, decide(
  tokenAlterEvenness
), 1, {
  matched: true,
  position: 3,
  value: 33
});

test('decide - nonmatch', numbers123Macro, decide(
  tokenSameEvenness
), 0, { matched: false });

test('decide - not enough tokens', numbers123Macro, decide(
  tokenSameEvenness
), 2, { matched: false });

test('chain - match 0', numbers123Macro, chain(
  any,
  (x) => (x % 2 === 0)
    ? tokenOdd
    : tokenEven
), 0, {
  matched: true,
  position: 2,
  value: 22
});

test('chain - match 1', numbers123Macro, chain(
  any,
  (x) => (x % 2 === 0)
    ? tokenOdd
    : tokenEven
), 1, {
  matched: true,
  position: 3,
  value: 33
});

test('chain - stop by condition', numbers123Macro, chain(
  any,
  (x, data, i, j) => (x + i + j === 25) // 22 + 1 + 2
    ? fail
    : any
), 1, { matched: false });

test('chain - not enough tokens', numbers123Macro, chain(
  any,
  (x) => (x % 2 === 0)
    ? tokenOdd
    : tokenEven
), 2, { matched: false });

test('ahead - match', numbers123Macro, ahead(
  many(any)
), 0, {
  matched: true,
  position: 0,
  value: [11, 22, 33]
});

test('ahead - nonmatch - lookAhead alias', numbers123Macro, lookAhead(
  tokenEven
), 0, { matched: false });

const recParser: Parser<number,unknown,number[]> = flatten(
  any,
  otherwise(
    recursive(() => recParser),
    emit([] as number[])
  )
);

test('recursive - match', numbers123Macro, recParser, 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

function recParser2 (data: Data<number,unknown>, i: number): Result<number[]> {
  return flatten(
    any as Parser<number,unknown,number|number[]>,
    otherwise(
      recParser2,
      emit([] as number[])
    )
  )(data, i);
}

test('recursive - no need for functions', numbers123Macro, recParser2, 0, {
  matched: true,
  position: 3,
  value: [11, 22, 33]
});

test('start - match', numbers123Macro, start, 0, {
  matched: true,
  position: 0,
  value: true
});

test('start - nonmatch', numbers123Macro, start, 3, { matched: false });

test('end - match', numbers123Macro, end, 3, {
  matched: true,
  position: 3,
  value: true
});

test('end - nonmatch', numbers123Macro, end, 0, { matched: false });

test('remainingTokensNumber', t => {
  t.is(
    remainingTokensNumber(data123, 1),
    2
  );
  t.is(
    remainingTokensNumber(data123, 3),
    0
  );
  t.is(
    remainingTokensNumber(data123, 4),
    -1
  );
});

test('parserPosition - on token', t => {
  t.is(
    parserPosition(data123, 1, (t) => String(t), 1),
    ' 0   11\n 1 > 22\n 2   33'
  );
});

test('parserPosition - on end', t => {
  t.is(
    parserPosition(data123, 3, (t) => String(t), 1),
    '     ...\n 2   33\n 3 >>'
  );
});

test('parserPosition - before start', t => {
  t.is(
    parserPosition(data123, -2, (t) => String(t), 1),
    '-2 >>\n 0   11\n     ...'
  );
});

test('parserPosition - after end', t => {
  t.is(
    parserPosition(data123, 5, (t) => String(t), 1),
    '     ...\n 2   33\n 5 >>'
  );
});

test('parse - match', t => {
  t.deepEqual(
    parse(many(any), data123.tokens, {}),
    [11,22,33]
  );
});

test('parse - nonmatch', t => {
  t.throws(
    () => parse(tokenEven, data123.tokens, {}),
    { message: 'No match' }
  );
});

test('parse - partial', t => {
  t.throws(
    () => parse(tokenOdd, data123.tokens, {}),
    { message: 'Partial match. Parsing stopped at:\n 0   11\n 1 > 22\n 2   33' }
  );
});

test('tryParse - match', t => {
  t.deepEqual(
    tryParse(many(any), data123.tokens, {}),
    [11,22,33]
  );
});

test('tryParse - nonmatch', t => {
  t.is(
    tryParse(tokenEven, data123.tokens, {}),
    undefined
  );
});

test('match - match', t => {
  t.deepEqual(
    match(many(any), data123.tokens, {}),
    [11,22,33]
  );
});
