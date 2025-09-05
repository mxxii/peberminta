import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { mapInner } from './mapInner.ts';
import { mapOuter } from './mapOuter.ts';

/**
 * This overload makes a {@link Matcher} that applies two matchers one after another and joins the results.
 *
 * Use {@link abc} if you want to join 3 different parsers/matchers.
 *
 * Use {@link left} or {@link right} if you want to keep one result and discard another.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 */
export function ab<TToken, TOptions, TValueA, TValueB, TValue> (
  /**
   * First matcher.
   */
  pa: Matcher<TToken, TOptions, TValueA>,
  /**
   * Second matcher.
   */
  pb: Matcher<TToken, TOptions, TValueB>,
  /**
   * A function to combine values from both matchers.
   *
   * @param va - A value matched by the first matcher.
   * @param vb - A value matched by the second matcher.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before both matchers matched).
   * @param j - Parser position in the tokens array (after both matchers matched).
   */
  join: (va: TValueA, vb: TValueB, data: Data<TToken, TOptions>, i: number, j: number) => TValue
): Matcher<TToken, TOptions, TValue>;

/**
 * Make a parser that tries two parsers one after another and joins the results.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Use {@link abc} if you want to join 3 different parsers.
 *
 * Use {@link left} or {@link right} if you want to keep one result and discard another.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 */
export function ab<TToken, TOptions, TValueA, TValueB, TValue> (
  /**
   * First parser.
   */
  pa: Parser<TToken, TOptions, TValueA>,
  /**
   * Second parser.
   */
  pb: Parser<TToken, TOptions, TValueB>,
  /**
   * A function to combine matched values from both parsers.
   *
   * @param va - A value matched by the first parser.
   * @param vb - A value matched by the second parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before both parsers matched).
   * @param j - Parser position in the tokens array (after both parsers matched).
   */
  join: (va: TValueA, vb: TValueB, data: Data<TToken, TOptions>, i: number, j: number) => TValue
): Parser<TToken, TOptions, TValue>;

export function ab<TToken, TOptions, TValueA, TValueB, TValue> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
  join: (va: TValueA, vb: TValueB, data: Data<TToken, TOptions>, i: number, j: number) => TValue,
): Parser<TToken, TOptions, TValue> {
  return (data, i) => mapOuter(
    pa(data, i),
    ma => mapInner(
      pb(data, ma.position),
      (vb, j) => join(ma.value, vb, data, i, j),
    ),
  );
}
