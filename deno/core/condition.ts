import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

/**
 * This overload makes a {@link Matcher} that chooses between two given matchers based on a condition.
 * This makes possible to allow/disallow a grammar based on context/options.
 *
 * {@link decide} and {@link chain} allow for more complex dynamic rules.
 */
export function condition<TToken, TOptions, TValueA, TValueB> (
  /**
   * Condition.
   *
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before parsing).
   */
  cond: (data: Data<TToken, TOptions>, i: number) => boolean,
  /**
   * Matcher to run when the condition is true.
   */
  pTrue: Matcher<TToken, TOptions, TValueA>,
  /**
   * Matcher to run when the condition is false.
   */
  pFalse: Matcher<TToken, TOptions, TValueB>
): Matcher<TToken, TOptions, TValueA | TValueB>;

/**
 * Make a parser that chooses between two given parsers based on a condition.
 * This makes possible to allow/disallow a grammar based on context/options.
 *
 * {@link decide} and {@link chain} allow for more complex dynamic rules.
 */
export function condition<TToken, TOptions, TValueA, TValueB> (
  /**
   * Condition.
   *
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before parsing).
   */
  cond: (data: Data<TToken, TOptions>, i: number) => boolean,
  /**
   * Parser to run when the condition is true.
   */
  pTrue: Parser<TToken, TOptions, TValueA>,
  /**
   * Parser to run when the condition is false.
   */
  pFalse: Parser<TToken, TOptions, TValueB>
): Parser<TToken, TOptions, TValueA | TValueB>;

export function condition<TToken, TOptions, TValueA, TValueB> (
  cond: (data: Data<TToken, TOptions>, i: number) => boolean,
  pTrue: Parser<TToken, TOptions, TValueA>,
  pFalse: Parser<TToken, TOptions, TValueB>,
): Parser<TToken, TOptions, TValueA | TValueB> {
  return (data, i) => (cond(data, i))
    ? pTrue(data, i)
    : pFalse(data, i);
}
