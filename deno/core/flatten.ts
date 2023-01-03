import { Matcher, Parser } from './types.ts';
import { all } from './all.ts';
import { map } from './map.ts';

/**
 * This overload makes a {@link Matcher} that concatenates values
 * from all provided Matchers into a single array while flattening value arrays.
 *
 * Implementation is based on {@link all} and {@link flatten1}.
 *
 * @param ps - Matchers sequence.
 * Each parser can return a match with a value or an array of values.
 */
export function flatten<TToken,TOptions,TValue> (
  ...ps: Matcher<TToken,TOptions,TValue|TValue[]>[]
): Matcher<TToken,TOptions,TValue[]>;
/**
 * Make a parser that concatenates values from all provided parsers
 * into a single array while flattening value arrays.
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Implementation is based on {@link all} and {@link flatten1}.
 *
 * @param ps - Parsers sequence.
 * Each parser can return a match with a value or an array of values.
 */
export function flatten<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue|TValue[]>[]
): Parser<TToken,TOptions,TValue[]>;
export function flatten<TToken,TOptions,TValue> (
  ...ps: Parser<TToken,TOptions,TValue|TValue[]>[]
): Parser<TToken,TOptions,TValue[]> {
  return flatten1(all(...ps));
}

/**
 * This overload makes a {@link Matcher} that flattens an array
 * of values or value arrays returned by a given Matcher.
 *
 * Implementation is based on {@link map}.
 *
 * @param p - A matcher.
 */
export function flatten1<TToken,TOptions,TValue> (
  p: Matcher<TToken,TOptions,(TValue|TValue[])[]>
): Matcher<TToken,TOptions,TValue[]>;
/**
 * Make a parser that flattens an array of values or value arrays
 * returned by a given parser.
 *
 * Implementation is based on {@link map}.
 *
 * @param p - A parser.
 */
export function flatten1<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,(TValue|TValue[])[]>
): Parser<TToken,TOptions,TValue[]>;
export function flatten1<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,(TValue|TValue[])[]>
) {
  return map( //
    p,
    (vs) => vs.flatMap((v) => v)
  );
}
