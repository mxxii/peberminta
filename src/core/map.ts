import { _mapInner, _mapOuter } from './coreUtils';
import { Data, Parser, Matcher, Match, Result } from './types';

/**
 * This overload makes a new {@link Matcher} that
 * transforms the matched value from a given Matcher.
 *
 * Use {@link map1} if some matched values can't be mapped.
 *
 * Use {@link ab} to map over values of two consecutive parsers.
 *
 * Use {@link abc} to map over values of three consecutive parsers.
 *
 * @param p - A base matcher.
 * @param mapper - A function that modifies the matched value.
 */
export function map<TToken,TOptions,TValue1,TValue2> (
  p: Matcher<TToken,TOptions,TValue1>,
  /**
   * @param v - A value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  mapper: (v: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => TValue2
): Matcher<TToken,TOptions,TValue2>;
/**
 * Make a new parser that transforms the matched value from a given parser.
 *
 * Use {@link map1} if some matched values can't be mapped.
 *
 * @param p - A base parser.
 * @param mapper - A function that modifies the matched value.
 */
export function map<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  /**
   * @param v - A value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  mapper: (v: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => TValue2
): Parser<TToken,TOptions,TValue2>;
export function map<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  mapper: (v: TValue1, data: Data<TToken,TOptions>, i: number, j: number) => TValue2
): Parser<TToken,TOptions,TValue2> {
  return (data, i) => _mapInner(p(data, i), (v, j) => mapper(v, data, i, j));
}

/**
 * Make a new parser that transforms the match from a given parser.
 *
 * This version can discard a {@link Match} - return a {@link NonMatch} instead.
 *
 * Note: pay attention to the return type and indices.
 *
 * Use {@link map} if mapping exists for all matched values.
 *
 * @param p - A base parser.
 * @param mapper - A function that modifies the match.
 */
export function map1<TToken,TOptions,TValue1,TValue2> (
  p: Parser<TToken,TOptions,TValue1>,
  /**
   * @param m - A {@link Match} object from the base parser (contains the value and the position after the match).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @returns A transformed {@link Result} object - either {@link Match} or {@link NonMatch}.
   */
  mapper: (m: Match<TValue1>, data: Data<TToken,TOptions>, i: number) => Result<TValue2>
): Parser<TToken,TOptions,TValue2> {
  return (data, i) => _mapOuter(p(data, i), (m) => mapper(m, data, i));
}
