import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { all } from './all.ts';
import { flatten1 } from './flatten1.ts';

/**
 * This overload makes a {@link Matcher} that concatenates values
 * from all provided Matchers into a single array while flattening value arrays.
 *
 * Implementation is based on {@link all} and {@link flatten1}.
 *
 * @param ps - Matchers sequence.
 * Each parser can return a match with a value or an array of values.
 */
export function flatten<TToken, TOptions, TValue> (
  ...ps: Matcher<TToken, TOptions, TValue | TValue[]>[]
): Matcher<TToken, TOptions, TValue[]>;

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
export function flatten<TToken, TOptions, TValue> (
  ...ps: Parser<TToken, TOptions, TValue | TValue[]>[]
): Parser<TToken, TOptions, TValue[]>;

export function flatten<TToken, TOptions, TValue> (
  ...ps: Parser<TToken, TOptions, TValue | TValue[]>[]
): Parser<TToken, TOptions, TValue[]> {
  return flatten1(all(...ps));
}
