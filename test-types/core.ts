import { expectTypeOf } from 'expect-type';

import {
  Parser, Matcher,
  make, token, map, peek, choice, otherwise,
  many, many1, ab, left, right, abc, middle, all, skip,
  flatten, flatten1, condition, ahead, recursive,
} from '../src/core';


const parser = token((t) => t === 42 ? 42 as const : undefined);
const matcher = make(() => 39 as const);

// map

expectTypeOf( map(parser, x => x) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( map(matcher, x => x) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// peek

expectTypeOf( peek(parser, () => { /* placeholder */ }) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( peek(matcher, () => { /* placeholder */ }) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// choice

expectTypeOf( choice(parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( choice() ).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf( choice(matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

expectTypeOf( choice(parser, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 42 | 39>>();

// otherwise

expectTypeOf( otherwise(parser, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( otherwise(parser, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 42 | 39>>();

// ab

expectTypeOf( ab(parser, parser, (a, b) => [a, b] as const) ).toEqualTypeOf<Parser<unknown, unknown, readonly [42, 42]>>();

expectTypeOf( ab(parser, matcher, (a, b) => [a, b] as const) ).toEqualTypeOf<Parser<unknown, unknown, readonly [42, 39]>>();

expectTypeOf( ab(matcher, parser, (a, b) => [a, b] as const) ).toEqualTypeOf<Parser<unknown, unknown, readonly [39, 42]>>();

expectTypeOf( ab(matcher, matcher, (a, b) => [a, b] as const) ).toEqualTypeOf<Matcher<unknown, unknown, readonly [39, 39]>>();

// left

expectTypeOf( left(parser, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( left(parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( left(matcher, parser) ).toEqualTypeOf<Parser<unknown, unknown, 39>>();

expectTypeOf( left(matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// right

expectTypeOf( right(parser, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( right(parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, 39>>();

expectTypeOf( right(matcher, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( right(matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// abc

expectTypeOf( abc(parser, parser, matcher, (a, b, c) => [a, b, c] as const) ).toEqualTypeOf<Parser<unknown, unknown, readonly [42, 42, 39]>>();

expectTypeOf( abc(parser, matcher, matcher, (a, b, c) => [a, b, c] as const) ).toEqualTypeOf<Parser<unknown, unknown, readonly [42, 39, 39]>>();

expectTypeOf( abc(matcher, parser, matcher, (a, b, c) => [a, b, c] as const) ).toEqualTypeOf<Parser<unknown, unknown, readonly [39, 42, 39]>>();

expectTypeOf( abc(matcher, matcher, matcher, (a, b, c) => [a, b, c] as const) ).toEqualTypeOf<Matcher<unknown, unknown, readonly [39, 39, 39]>>();

// middle

expectTypeOf( middle(parser, parser, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( middle(parser, matcher, matcher) ).toEqualTypeOf<Parser<unknown, unknown, 39>>();

expectTypeOf( middle(matcher, parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( middle(matcher, matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// all

expectTypeOf( all(parser) ).toEqualTypeOf<Parser<unknown, unknown, 42[]>>();

expectTypeOf( all(parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, (42 | 39)[]>>();

expectTypeOf( all() ).toEqualTypeOf<Matcher<unknown, unknown, unknown[]>>();

expectTypeOf( all(matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39[]>>();

// skip

expectTypeOf( skip(parser) ).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf( skip(parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, unknown>>();

expectTypeOf( skip() ).toEqualTypeOf<Matcher<unknown, unknown, unknown>>();

expectTypeOf( skip(matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, unknown>>();

// flatten

expectTypeOf( flatten(parser) ).toEqualTypeOf<Parser<unknown, unknown, 42[]>>();

expectTypeOf( flatten(parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, (42 | 39)[]>>();

expectTypeOf( flatten() ).toEqualTypeOf<Matcher<unknown, unknown, unknown[]>>();

expectTypeOf( flatten(matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39[]>>();

// flatten1

expectTypeOf( flatten1(many1(parser)) ).toEqualTypeOf<Parser<unknown, unknown, 42[]>>();

expectTypeOf( flatten1(many(matcher)) ).toEqualTypeOf<Matcher<unknown, unknown, 39[]>>();

// condition

expectTypeOf( condition(() => true, parser, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( condition(() => true, parser, matcher) ).toEqualTypeOf<Parser<unknown, unknown, 42 | 39>>();

expectTypeOf( condition(() => true, matcher, parser) ).toEqualTypeOf<Parser<unknown, unknown, 42 | 39>>();

expectTypeOf( condition(() => true, matcher, matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// ahead

expectTypeOf( ahead(parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( ahead(matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();

// recursive

expectTypeOf( recursive(() => parser) ).toEqualTypeOf<Parser<unknown, unknown, 42>>();

expectTypeOf( recursive(() => matcher) ).toEqualTypeOf<Matcher<unknown, unknown, 39>>();
