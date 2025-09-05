import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { takeWhile } from './takeWhile.ts';

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the same given parser *while* the test function
 * equates to `false` (that is *until* it equates to `true` for the first time).
 *
 * Use {@link many} if there is no stop condition.
 *
 * Use {@link takeUntilP} if the stop condition is expressed as a parser.
 *
 * Implementation is based on {@link takeWhile}.
 */
export function takeUntil<TToken, TOptions, TValue> (
  /**
   * A parser.
   */
  p: Parser<TToken, TOptions, TValue>,
  /**
   * Matched results are accumulated *until* the result of this function is `true`.
   *
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the current value matched).
   * @param j - Parser position in the tokens array (after the current value matched).
   */
  test: (value: TValue, n: number, data: Data<TToken, TOptions>, i: number, j: number) => boolean,
): Matcher<TToken, TOptions, TValue[]> {
  return takeWhile(p, (value, n, data, i, j) => !test(value, n, data, i, j));
}
