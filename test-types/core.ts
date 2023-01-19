import { expectNotType, expectType } from 'tsd';

import {
  Parser, Matcher,
  make, token, map, peek, choice, otherwise,
  many, many1, ab, left, right, abc, middle, all, skip,
  flatten, flatten1, condition, ahead, recursive,
} from '../src/core';


const parser = token((t) => t === 42 ? t : undefined);
const matcher = make(() => 39 as const);

// map

expectType<Parser<unknown, unknown, 42>>( map(parser, x => x) );
expectNotType<Matcher<unknown, unknown, 42>>( map(parser, x => x) );

expectType<Matcher<unknown, unknown, 39>>( map(matcher, x => x) );

// peek

expectType<Parser<unknown, unknown, 42>>( peek(parser, () => { /* placeholder */ }) );
expectNotType<Matcher<unknown, unknown, 42>>( peek(parser, () => { /* placeholder */ }) );

expectType<Matcher<unknown, unknown, 39>>( peek(matcher, () => { /* placeholder */ }) );

// choice

expectType<Parser<unknown, unknown, 42>>( choice(parser) );
expectNotType<Matcher<unknown, unknown, 42>>( choice(parser) );

expectType<Parser<unknown, unknown, unknown>>( choice() );
expectNotType<Matcher<unknown, unknown, unknown>>( choice() );

expectType<Matcher<unknown, unknown, 39>>( choice(matcher) );

expectType<Matcher<unknown, unknown, 42 | 39>>( choice(parser, matcher) );

// otherwise

expectType<Parser<unknown, unknown, 42>>( otherwise(parser, parser) );
expectNotType<Matcher<unknown, unknown, 42>>( otherwise(parser, parser) );

expectType<Matcher<unknown, unknown, 42 | 39>>( otherwise(parser, matcher) );

// ab

expectType<Parser<unknown, unknown, readonly [42, 42]>>( ab(parser, parser, (a, b) => [a, b] as const) );
expectNotType<Matcher<unknown, unknown, readonly [42, 42]>>( ab(parser, parser, (a, b) => [a, b] as const) );

expectType<Parser<unknown, unknown, readonly [42, 39]>>( ab(parser, matcher, (a, b) => [a, b] as const) );
expectNotType<Matcher<unknown, unknown, readonly [42, 39]>>( ab(parser, matcher, (a, b) => [a, b] as const) );

expectType<Parser<unknown, unknown, readonly [39, 42]>>( ab(matcher, parser, (a, b) => [a, b] as const) );
expectNotType<Matcher<unknown, unknown, readonly [39, 42]>>( ab(matcher, parser, (a, b) => [a, b] as const) );

expectType<Matcher<unknown, unknown, readonly [39, 39]>>( ab(matcher, matcher, (a, b) => [a, b] as const) );

// left

expectType<Parser<unknown, unknown, 42>>( left(parser, parser) );
expectNotType<Matcher<unknown, unknown, 42>>( left(parser, parser) );

expectType<Parser<unknown, unknown, 42>>( left(parser, matcher) );
expectNotType<Matcher<unknown, unknown, 42>>( left(parser, matcher) );

expectType<Parser<unknown, unknown, 39>>( left(matcher, parser) );
expectNotType<Matcher<unknown, unknown, 39>>( left(matcher, parser) );

expectType<Matcher<unknown, unknown, 39>>( left(matcher, matcher) );

// right

expectType<Parser<unknown, unknown, 42>>( right(parser, parser) );
expectNotType<Matcher<unknown, unknown, 42>>( right(parser, parser) );

expectType<Parser<unknown, unknown, 39>>( right(parser, matcher) );
expectNotType<Matcher<unknown, unknown, 39>>( right(parser, matcher) );

expectType<Parser<unknown, unknown, 42>>( right(matcher, parser) );
expectNotType<Matcher<unknown, unknown, 42>>( right(matcher, parser) );

expectType<Matcher<unknown, unknown, 39>>( right(matcher, matcher) );

// abc

expectType<Parser<unknown, unknown, readonly [42, 42, 39]>>( abc(parser, parser, matcher, (a, b, c) => [a, b, c] as const) );
expectNotType <Matcher<unknown, unknown, readonly [42, 42, 39]>>( abc(parser, parser, matcher, (a, b, c) => [a, b, c] as const) );

expectType<Parser<unknown, unknown, readonly [42, 39, 39]>>( abc(parser, matcher, matcher, (a, b, c) => [a, b, c] as const) );
expectNotType<Matcher<unknown, unknown, readonly [42, 42, 39]>>( abc(parser, matcher, matcher, (a, b, c) => [a, b, c] as const) );

expectType<Parser<unknown, unknown, readonly [39, 42, 39]>>( abc(matcher, parser, matcher, (a, b, c) => [a, b, c] as const) );
expectNotType<Matcher<unknown, unknown, readonly [42, 42, 39]>>( abc(matcher, parser, matcher, (a, b, c) => [a, b, c] as const) );

expectType<Matcher<unknown, unknown, readonly [39, 39, 39]>>( abc(matcher, matcher, matcher, (a, b, c) => [a, b, c] as const) );

// middle

expectType<Parser<unknown, unknown, 42>>( middle(parser, parser, parser) );
expectNotType<Matcher<unknown, unknown, 42>>( middle(parser, parser, parser) );

expectType<Parser<unknown, unknown, 39>>( middle(parser, matcher, matcher) );
expectNotType<Matcher<unknown, unknown, 39>>( middle(parser, matcher, matcher) );

expectType<Parser<unknown, unknown, 42>>( middle(matcher, parser, matcher) );
expectNotType<Matcher<unknown, unknown, 42>>( middle(matcher, parser, matcher) );

expectType<Matcher<unknown, unknown, 39>>( middle(matcher, matcher, matcher) );

// all

expectType<Parser<unknown, unknown, 42[]>>( all(parser) );
expectNotType<Matcher<unknown, unknown, 42[]>>( all(parser) );

expectType<Parser<unknown, unknown, (42 | 39)[]>>( all(parser, matcher) );
expectNotType<Matcher<unknown, unknown, (42 | 39)[]>>( all(parser, matcher) );

expectType<Matcher<unknown, unknown, unknown[]>>( all() );

expectType<Matcher<unknown, unknown, 39[]>>( all(matcher, matcher) );

// skip

expectType<Parser<unknown, unknown, unknown>>( skip(parser) );
expectNotType<Matcher<unknown, unknown, unknown>>( skip(parser) );

expectType<Parser<unknown, unknown, unknown>>( skip(parser, matcher) );
expectNotType<Matcher<unknown, unknown, unknown>>( skip(parser, matcher) );

expectType<Matcher<unknown, unknown, unknown>>( skip() );

expectType<Matcher<unknown, unknown, unknown>>( skip(matcher, matcher) );

// flatten

expectType<Parser<unknown, unknown, 42[]>>( flatten(parser) );
expectNotType<Matcher<unknown, unknown, 42[]>>( flatten(parser) );

expectType<Parser<unknown, unknown, (42 | 39)[]>>( flatten(parser, matcher) );
expectNotType<Matcher<unknown, unknown, (42 | 39)[]>>( flatten(parser, matcher) );

expectType<Matcher<unknown, unknown, unknown[]>>( flatten() );

expectType<Matcher<unknown, unknown, 39[]>>( flatten(matcher, matcher) );

// flatten1

expectType<Parser<unknown, unknown, 42[]>>( flatten1(many1(parser)) );
expectNotType<Matcher<unknown, unknown, 42[]>>( flatten1(many1(parser)) );

expectType<Matcher<unknown, unknown, 39[]>>( flatten1(many(matcher)) );

// condition

expectType<Parser<unknown, unknown, 42>>( condition(() => true, parser, parser) );
expectNotType<Matcher<unknown, unknown, 42>>( condition(() => true, parser, parser) );

expectType<Parser<unknown, unknown, 42 | 39>>( condition(() => true, parser, matcher) );
expectNotType<Matcher<unknown, unknown, 42 | 39>>( condition(() => true, parser, matcher) );

expectType<Parser<unknown, unknown, 42 | 39>>( condition(() => true, matcher, parser) );
expectNotType<Matcher<unknown, unknown, 42 | 39>>( condition(() => true, matcher, parser) );

expectType<Matcher<unknown, unknown, 39>>( condition(() => true, matcher, matcher) );

// ahead

expectType<Parser<unknown, unknown, 42>>( ahead(parser) );
expectNotType<Matcher<unknown, unknown, 42>>( ahead(parser) );

expectType<Matcher<unknown, unknown, 39>>( ahead(matcher) );

// recursive

expectType<Parser<unknown, unknown, 42>>( recursive(() => parser) );
expectNotType<Matcher<unknown, unknown, 42>>( recursive(() => parser) );

expectType<Matcher<unknown, unknown, 39>>( recursive(() => matcher) );
