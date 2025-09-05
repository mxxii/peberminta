import type { Data } from '../coreTypes/Data.ts';
import type { Match } from '../coreTypes/Match.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';
import type { Result } from '../coreTypes/Result.ts';

/**
 * This overload adds a side effect to a {@link Matcher} without changing it's result.
 *
 * Use {@link action} if there is nothing to wrap and you need a non-consuming parser instead.
 */
export function peek<TToken, TOptions, TValue> (
  /**
   * A matcher.
   */
  p: Matcher<TToken, TOptions, TValue>,
  /**
   * A function to produce a side effect (logging, etc).
   *
   * @param r - A {@link Result} object after running the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   */
  f: (r: Match<TValue>, data: Data<TToken, TOptions>, i: number) => void
): Matcher<TToken, TOptions, TValue>;

/**
 * Add a side effect to a parser without changing it's result.
 *
 * Use {@link action} if there is nothing to wrap and you need a non-consuming parser instead.
 */
export function peek<TToken, TOptions, TValue> (
  /**
   * A parser.
   */
  p: Parser<TToken, TOptions, TValue>,
  /**
   * A function to produce a side effect (logging, etc).
   *
   * @param r - A {@link Result} object after running the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   */
  f: (r: Result<TValue>, data: Data<TToken, TOptions>, i: number) => void
): Parser<TToken, TOptions, TValue>;

export function peek<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
  f: (r: Match<TValue>, data: Data<TToken, TOptions>, i: number) => void,
): Parser<TToken, TOptions, TValue> {
  return (data, i) => {
    const r = p(data, i);
    f(r as Match<TValue>, data, i);
    return r;
  };
}
