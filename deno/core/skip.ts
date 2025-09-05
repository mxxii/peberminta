import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { all } from './all.ts';
import { map } from './map.ts';

/**
 * This overload makes a {@link Matcher} that runs all given matchers in sequence
 * and discards (skips) all results (Returns a match with a dummy value).
 *
 * Implementation is based on {@link all} and {@link map}.
 *
 * This function only exists to make the intent clear.
 * Use in combination with {@link left}, {@link right} or other combinators
 * to make the dummy result disappear.
 *
 * @param ps - Parsers to run sequentially.
 */
export function skip<TToken, TOptions> (
  ...ps: Matcher<TToken, TOptions, unknown>[]
): Matcher<TToken, TOptions, unknown>;

/**
 * Make a parser that runs all given parsers in sequence
 * and discards (skips) all results (Returns a match with a dummy value).
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Implementation is based on {@link all} and {@link map}.
 *
 * This function only exists to make the intent clear.
 * Use in combination with {@link left}, {@link right} or other combinators
 * to make the dummy result disappear.
 *
 * @param ps - Parsers to run sequentially.
 */
export function skip<TToken, TOptions> (
  ...ps: Parser<TToken, TOptions, unknown>[]
): Parser<TToken, TOptions, unknown>;

export function skip<TToken, TOptions> (
  ...ps: Parser<TToken, TOptions, unknown>[]
): Parser<TToken, TOptions, unknown> {
  return map(all(...ps), () => null);
}
