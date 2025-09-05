import type { Parser } from '../coreTypes/Parser.ts';
import type { Data } from '../coreTypes/Data.ts';

import { mapOuter } from './mapOuter.ts';

/**
 * Make a new parser that keeps a match from a given parser only if a predicate passes;
 * otherwise discards it (returns a NonMatch).
 *
 * This overload uses a type guard predicate to narrow the value type on success.
 *
 * Use {@link satisfy} to test a token at the current position instead of a value matched by another parser.
 *
 * Use {@link takeWhile} to accumulate 0 or more matches while predicate holds.
 *
 * {@link mapR} can be used if you need to filter and transform matches at the same time.
 * But it is better to use `filter` and {@link map} instead in most cases.
 */
export function filter<TToken, TOptions, TValue1, TValue2 extends TValue1> (
  /**
   * A base parser.
   */
  p: Parser<TToken, TOptions, TValue1>,
  /**
   * A type-guard predicate applied to the matched value to decide whether to keep it.
   *
   * @param value - Value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position before the base parser matched.
   * @param j - Parser position after the base parser matched.
   */
  test: (value: TValue1, data: Data<TToken, TOptions>, i: number, j: number) => value is TValue2,
): Parser<TToken, TOptions, TValue2>;

/**
 * Make a new parser that keeps a match from a given parser only if a predicate passes;
 * otherwise discards it (returns a NonMatch).
 *
 * Use {@link satisfy} to test a token at the current position instead of a value matched by another parser.
 *
 * Use {@link takeWhile} to accumulate 0 or more matches while predicate holds.
 *
 * {@link mapR} can be used if you need to filter and transform matches at the same time.
 * But it is better to use `filter` and {@link map} instead in most cases.
 */
export function filter<TToken, TOptions, TValue> (
  /**
   * A base parser.
   */
  p: Parser<TToken, TOptions, TValue>,
  /**
   * A predicate applied to the matched value to decide whether to keep it.
   *
   * @param value - Value matched by the base parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position before the base parser matched.
   * @param j - Parser position after the base parser matched.
   */
  test: (value: TValue, data: Data<TToken, TOptions>, i: number, j: number) => boolean,
): Parser<TToken, TOptions, TValue>;

export function filter<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
  test: (value: TValue, data: Data<TToken, TOptions>, i: number, j: number) => boolean,
): Parser<TToken, TOptions, TValue> {
  return (data, i) => mapOuter(
    p(data, i),
    m => test(m.value, data, i, m.position)
      ? m
      : { matched: false },
  );
}
