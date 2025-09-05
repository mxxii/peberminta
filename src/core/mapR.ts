import type { Data } from '../coreTypes/Data.ts';
import type { Match } from '../coreTypes/Match.ts';
import type { Parser } from '../coreTypes/Parser.ts';
import type { Result } from '../coreTypes/Result.ts';

import { mapOuter } from './mapOuter.ts';

/**
 * Make a new parser that transforms the match from a given parser to any {@link Result}.
 *
 * This version can discard a {@link Match} - return a {@link NonMatch} instead.
 *
 * Note: pay attention to the return type and indices.
 *
 * Use {@link map} if mapping exists for all matched values.
 *
 * Use {@link filter} for discarding some matches based on a condition, without modifying.
 */
export function mapR<TToken, TOptions, TValue1, TValue2> (
  /**
   * A base parser.
   */
  p: Parser<TToken, TOptions, TValue1>,
  /**
   * A function that modifies the match.
   *
   * @param m - A {@link Match} object from the base parser (contains the value and the position after the match).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @returns A transformed {@link Result} object - either {@link Match} or {@link NonMatch}.
   */
  mapper: (m: Match<TValue1>, data: Data<TToken, TOptions>, i: number) => Result<TValue2>,
): Parser<TToken, TOptions, TValue2> {
  return (data, i) => mapOuter(p(data, i), m => mapper(m, data, i));
}
