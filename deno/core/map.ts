import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { mapInner } from './mapInner.ts';

/**
 * This overload makes a new {@link Matcher} that
 * transforms the matched value from a given Matcher.
 *
 * Use {@link mapR} if some matched values can't be mapped.
 *
 * Use {@link ab} to map over values of two consecutive parsers.
 *
 * Use {@link abc} to map over values of three consecutive parsers.
 */
export function map<TToken, TOptions, TValue1, TValue2> (
  /**
   * A base matcher.
   */
  p: Matcher<TToken, TOptions, TValue1>,
  /**
   * A function that modifies the matched value.
   *
   * @param v - A value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  mapper: (v: TValue1, data: Data<TToken, TOptions>, i: number, j: number) => TValue2
): Matcher<TToken, TOptions, TValue2>;

/**
 * Make a new parser that transforms the matched value from a given parser.
 *
 * Use {@link mapR} if some matched values can't be mapped.
 */
export function map<TToken, TOptions, TValue1, TValue2> (
  /**
   * A base parser.
   */
  p: Parser<TToken, TOptions, TValue1>,
  /**
   * A function that modifies the matched value.
   *
   * @param v - A value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  mapper: (v: TValue1, data: Data<TToken, TOptions>, i: number, j: number) => TValue2
): Parser<TToken, TOptions, TValue2>;

export function map<TToken, TOptions, TValue1, TValue2> (
  p: Parser<TToken, TOptions, TValue1>,
  mapper: (v: TValue1, data: Data<TToken, TOptions>, i: number, j: number) => TValue2,
): Parser<TToken, TOptions, TValue2> {
  return (data, i) => mapInner(p(data, i), (v, j) => mapper(v, data, i, j));
}
