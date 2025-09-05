import { expectTypeOf } from 'expect-type';

import type { Parser } from '../src/core.ts';
import type { CharUnion, GraphemeUnion } from '../src/char.ts';

import { all } from '../src/core.ts';
import { char, str, oneOf, noneOf, concat } from '../src/char.ts';


type DummyOptions = { dummy: true };


// CharUnion

expectTypeOf<CharUnion<'abc'>>().toEqualTypeOf<'a' | 'b' | 'c'>();

expectTypeOf<CharUnion<string>>().toEqualTypeOf<string>();

// GraphemeUnion

expectTypeOf<GraphemeUnion<'abcd'>>().toEqualTypeOf<'a' | 'b' | 'c' | 'd'>();

expectTypeOf<GraphemeUnion<['a', 'b', 'cd']>>().toEqualTypeOf<'a' | 'b' | 'cd'>();

expectTypeOf<GraphemeUnion<['a', string, 'cd']>>().toEqualTypeOf<string>();

expectTypeOf<GraphemeUnion<string>>().toEqualTypeOf<string>();

expectTypeOf<GraphemeUnion<string[]>>().toEqualTypeOf<string>();


// char

expectTypeOf(char('a')).toEqualTypeOf<Parser<string, unknown, 'a'>>();
expectTypeOf(char<DummyOptions, 'a'>('a')).toEqualTypeOf<Parser<string, DummyOptions, 'a'>>();

// str

expectTypeOf(str('abc')).toEqualTypeOf<Parser<string, unknown, 'abc'>>();
expectTypeOf(str<DummyOptions, 'abc'>('abc')).toEqualTypeOf<Parser<string, DummyOptions, 'abc'>>();

// oneOf

expectTypeOf(oneOf('abcd')).toEqualTypeOf<Parser<string, unknown, 'a' | 'b' | 'c' | 'd'>>();
expectTypeOf(oneOf<DummyOptions, 'abcd'>('abcd')).toEqualTypeOf<Parser<string, DummyOptions, 'a' | 'b' | 'c' | 'd'>>();

expectTypeOf(oneOf(['a', 'b', 'cd'])).toEqualTypeOf<Parser<string, unknown, 'a' | 'b' | 'cd'>>();
expectTypeOf(oneOf<DummyOptions, ['a', 'b', 'cd']>(['a', 'b', 'cd'])).toEqualTypeOf<Parser<string, DummyOptions, 'a' | 'b' | 'cd'>>();

// concat

expectTypeOf(concat(str('a'), str('b'), str('cd'))).toEqualTypeOf<Parser<string, unknown, string>>();
expectTypeOf(concat(
  str<DummyOptions, 'a'>('a'),
  str<DummyOptions, 'b'>('b'),
  str<DummyOptions, 'cd'>('cd'),
)).toEqualTypeOf<Parser<string, DummyOptions, string>>();

expectTypeOf(concat(str('a'), str('b'), noneOf('cd'))).toEqualTypeOf<Parser<string, unknown, string>>();

expectTypeOf(concat(str('a'), str('b'), oneOf('cd'))).toEqualTypeOf<Parser<string, unknown, string>>();

expectTypeOf(concat(str('a'), all(str('b'), str('c')))).toEqualTypeOf<Parser<string, unknown, string>>();

expectTypeOf(concat()).toEqualTypeOf<Parser<string, unknown, string>>();
