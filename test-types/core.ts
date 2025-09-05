import { expectTypeOf } from 'expect-type';

import type { Parser, Matcher, TupleOf } from '../src/core.ts';

import {
  emit, make, token, map, peek, first, last, eitherOr,
  many, many1, ab, left, right, abc, middle, all, any, skip,
  flatten, flatten1, condition, ahead, recursive,
  longest, takeN, takeMinMax, takeWhile, satisfy, filter,
} from '../src/core.ts';


type DummyToken = { value: number | string };
type DummyOptions = { dummy: true };

const parser = token<DummyToken, DummyOptions, 42>(t => t.value === 42 ? 42 as const : undefined);
const matcher = make<DummyToken, DummyOptions, 39>(() => 39 as const);


// TupleOf

expectTypeOf<TupleOf<'a', 0>>().toEqualTypeOf<[]>();

expectTypeOf<TupleOf<'a', 3>>().toEqualTypeOf<['a', 'a', 'a']>();

expectTypeOf<TupleOf<number, 2>>().toEqualTypeOf<[number, number]>();

expectTypeOf<TupleOf<42, number>>().toEqualTypeOf<42[]>();


// emit

expectTypeOf(emit(42)).toEqualTypeOf<Matcher<unknown, unknown, 42>>();

// map

expectTypeOf(map(parser, x => x)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(map(matcher, x => x)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// peek

expectTypeOf(peek(parser, () => { /* placeholder */ })).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(peek(matcher, () => { /* placeholder */ })).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// first

expectTypeOf(first(parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(first()).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf(first(matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

expectTypeOf(first(parser, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 42 | 39>>();

expectTypeOf(first(parser, matcher, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42 | 39>>();

// last

expectTypeOf(last(parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(last()).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf(last(matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

expectTypeOf(last(matcher, parser)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 42 | 39>>();

expectTypeOf(last(parser, matcher, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42 | 39>>();


// longest

expectTypeOf(longest(parser, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(longest()).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf(longest(parser, matcher, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42 | 39>>();

// eitherOr

expectTypeOf(eitherOr(parser, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(eitherOr(parser, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 42 | 39>>();

// ab

expectTypeOf(ab(parser, parser, (a, b) => [a, b] as const)).toEqualTypeOf<Parser<DummyToken, DummyOptions, readonly [42, 42]>>();

expectTypeOf(ab(parser, matcher, (a, b) => [a, b] as const)).toEqualTypeOf<Parser<DummyToken, DummyOptions, readonly [42, 39]>>();

expectTypeOf(ab(matcher, parser, (a, b) => [a, b] as const)).toEqualTypeOf<Parser<DummyToken, DummyOptions, readonly [39, 42]>>();

expectTypeOf(ab(matcher, matcher, (a, b) => [a, b] as const)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, readonly [39, 39]>>();

// left

expectTypeOf(left(parser, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(left(parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(left(matcher, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 39>>();

expectTypeOf(left(matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// right

expectTypeOf(right(parser, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(right(parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 39>>();

expectTypeOf(right(matcher, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(right(matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// abc

expectTypeOf(abc(parser, parser, matcher, (a, b, c) => [a, b, c] as const)).toEqualTypeOf<Parser<DummyToken, DummyOptions, readonly [42, 42, 39]>>();

expectTypeOf(abc(parser, matcher, matcher, (a, b, c) => [a, b, c] as const)).toEqualTypeOf<Parser<DummyToken, DummyOptions, readonly [42, 39, 39]>>();

expectTypeOf(abc(matcher, parser, matcher, (a, b, c) => [a, b, c] as const)).toEqualTypeOf<Parser<DummyToken, DummyOptions, readonly [39, 42, 39]>>();

expectTypeOf(abc(matcher, matcher, matcher, (a, b, c) => [a, b, c] as const)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, readonly [39, 39, 39]>>();

// middle

expectTypeOf(middle(parser, parser, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(middle(parser, matcher, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 39>>();

expectTypeOf(middle(matcher, parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(middle(matcher, matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// all

expectTypeOf(all(parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42[]>>();

expectTypeOf(all(parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, (42 | 39)[]>>();

expectTypeOf(all()).toEqualTypeOf<Matcher<unknown, unknown, unknown[]>>();

expectTypeOf(all(matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39[]>>();

// skip

expectTypeOf(skip(parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, unknown>>();

expectTypeOf(skip(parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, unknown>>();

expectTypeOf(skip()).toEqualTypeOf<Matcher<unknown, unknown, unknown>>();

expectTypeOf(skip(matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, unknown>>();

// flatten

expectTypeOf(flatten(parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42[]>>();

expectTypeOf(flatten(parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, (42 | 39)[]>>();

expectTypeOf(flatten()).toEqualTypeOf<Matcher<unknown, unknown, unknown[]>>();

expectTypeOf(flatten(matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39[]>>();

// flatten1

expectTypeOf(flatten1(many1(parser))).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42[]>>();

expectTypeOf(flatten1(many(matcher))).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39[]>>();

// condition

expectTypeOf(condition(() => true, parser, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(condition(() => true, parser, matcher)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42 | 39>>();

expectTypeOf(condition(() => true, matcher, parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42 | 39>>();

expectTypeOf(condition(() => true, matcher, matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// ahead

expectTypeOf(ahead(parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(ahead(matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// recursive

expectTypeOf(recursive(() => parser)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

expectTypeOf(recursive(() => matcher)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39>>();

// takeN

expectTypeOf(takeN(emit(42), 3)).toEqualTypeOf<Parser<unknown, unknown, [42, 42, 42]>>();

expectTypeOf(takeN(parser, 3)).toEqualTypeOf<Parser<DummyToken, DummyOptions, [42, 42, 42]>>();

expectTypeOf(takeN(parser, 0)).toEqualTypeOf<Parser<DummyToken, DummyOptions, []>>();

// takeMinMax

expectTypeOf(takeMinMax(parser, 2, 3)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42[]>>();

expectTypeOf(takeMinMax(parser, 0, 0)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42[]>>();

expectTypeOf(takeMinMax(parser, undefined, undefined)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42[]>>();

// takeWhile

expectTypeOf(takeWhile(any<DummyToken, DummyOptions>, () => true)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, DummyToken[]>>();

expectTypeOf(takeWhile(
  any<DummyToken, DummyOptions>,
  (m): m is { value: number } => typeof m.value === 'number'),
).toEqualTypeOf<Matcher<DummyToken, DummyOptions, { value: number }[]>>();

expectTypeOf(takeWhile(first(parser, matcher), () => true)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, (39 | 42)[]>>();

expectTypeOf(takeWhile(first(parser, matcher), m => m === 39)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 39[]>>();

expectTypeOf(takeWhile(first(parser, matcher), m => m === 42)).toEqualTypeOf<Matcher<DummyToken, DummyOptions, 42[]>>();

// filter

expectTypeOf(filter(any<DummyToken, DummyOptions>, () => true)).toEqualTypeOf<Parser<DummyToken, DummyOptions, DummyToken>>();

expectTypeOf(filter(
  any<DummyToken, DummyOptions>,
  (m): m is { value: number } => typeof m.value === 'number'),
).toEqualTypeOf<Parser<DummyToken, DummyOptions, { value: number }>>();

expectTypeOf(filter(first(parser, matcher), () => true)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 39 | 42>>();

expectTypeOf(filter(first(parser, matcher), m => m === 39)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 39>>();

expectTypeOf(filter(first(parser, matcher), m => m === 42)).toEqualTypeOf<Parser<DummyToken, DummyOptions, 42>>();

// satisfy

expectTypeOf(satisfy(() => true)).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf(satisfy<DummyToken, DummyOptions>(() => true)).toEqualTypeOf<Parser<DummyToken, DummyOptions, DummyToken>>();

expectTypeOf(satisfy<DummyToken, DummyOptions, { value: number }>(
  (m): m is { value: number } => typeof m.value === 'number',
)).toEqualTypeOf<Parser<DummyToken, DummyOptions, { value: number }>>();

expectTypeOf(satisfy(
  (m): m is { value: 39 } => (m as { value?: unknown }).value === 39,
)).toEqualTypeOf<Parser<unknown, unknown, { value: 39 }>>();
