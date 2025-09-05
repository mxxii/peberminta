import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { mapInner } from './mapInner.ts';
import { mapOuter } from './mapOuter.ts';

/**
 * This overload makes a {@link Matcher} that applies three matchers one after another and joins the results.
 *
 * Use {@link ab} if you want to join just 2 different parsers/matchers.
 *
 * Use {@link middle} if you want to keep only the middle result and discard two others.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 */
export function abc<TToken, TOptions, TValueA, TValueB, TValueC, TValue> (
  /**
   * First matcher.
   */
  pa: Matcher<TToken, TOptions, TValueA>,
  /**
   * Second matcher.
   */
  pb: Matcher<TToken, TOptions, TValueB>,
  /**
   * Third matcher.
   */
  pc: Matcher<TToken, TOptions, TValueC>,
  /**
   * A function to combine matched values from all three matchers.
   *
   * @param va - A value matched by the first matcher.
   * @param vb - A value matched by the second matcher.
   * @param vc - A value matched by the third matcher.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before all three matchers matched).
   * @param j - Parser position in the tokens array (after all three matchers matched).
   */
  join: (va: TValueA, vb: TValueB, vc: TValueC, data: Data<TToken, TOptions>, i: number, j: number) => TValue
): Matcher<TToken, TOptions, TValue>;

/**
 * Make a parser that tries three parsers one after another and joins the results.
 *
 * A nonmatch is returned if any of three parsers did not match.
 *
 * Use {@link ab} if you want to join just 2 different parsers.
 *
 * Use {@link middle} if you want to keep only the middle result and discard two others.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 */
export function abc<TToken, TOptions, TValueA, TValueB, TValueC, TValue> (
  /**
   * First parser.
   */
  pa: Parser<TToken, TOptions, TValueA>,
  /**
   * Second parser.
   */
  pb: Parser<TToken, TOptions, TValueB>,
  /**
   * Third parser.
   */
  pc: Parser<TToken, TOptions, TValueC>,
  /**
   * A function to combine matched results from all three parsers.
   *
   * @param va - A value matched by the first parser.
   * @param vb - A value matched by the second parser.
   * @param vc - A value matched by the third parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before all three parsers matched).
   * @param j - Parser position in the tokens array (after all three parsers matched).
   */
  join: (va: TValueA, vb: TValueB, vc: TValueC, data: Data<TToken, TOptions>, i: number, j: number) => TValue
): Parser<TToken, TOptions, TValue>;

export function abc<TToken, TOptions, TValueA, TValueB, TValueC, TValue> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
  pc: Parser<TToken, TOptions, TValueC>,
  join: (va: TValueA, vb: TValueB, vc: TValueC, data: Data<TToken, TOptions>, i: number, j: number) => TValue,
): Parser<TToken, TOptions, TValue> {
  return (data, i) => mapOuter(
    pa(data, i),
    ma => mapOuter(
      pb(data, ma.position),
      mb => mapInner(
        pc(data, mb.position),
        (vc, j) => join(ma.value, mb.value, vc, data, i, j),
      ),
    ),
  );
}
