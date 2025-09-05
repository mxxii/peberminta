import type { Data } from '../coreTypes/Data.ts';
import type { Match } from '../coreTypes/Match.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

/**
 * This overload makes a {@link Matcher} that returns all (0 or more)
 * sequential matches of the same given parser *while* the type guard test passes.
 *
 * Use {@link many} if there is no stop condition.
 *
 * Use {@link takeWhileP} if the stop condition is expressed as a parser.
 *
 * Use {@link filter} to take one match or a non-match based on a test function (can also be a type guard).
 */
export function takeWhile<TToken, TOptions, TValue1, TValue2 extends TValue1> (
  /**
   * A parser.
   */
  p: Parser<TToken, TOptions, TValue1>,
  /**
   * Matched results are accumulated *while* this type guard test passes.
   *
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Position before the current value matched.
   * @param j - Position after the current value matched.
   */
  test: (value: TValue1, n: number, data: Data<TToken, TOptions>, i: number, j: number) => value is TValue2,
): Matcher<TToken, TOptions, TValue2[]>;

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the same given parser *while* the test function
 * equates to `true`.
 *
 * Use {@link many} if there is no stop condition.
 *
 * Use {@link takeWhileP} if the stop condition is expressed as a parser.
 *
 * Use {@link filter} to take one match or a non-match based on a test function.
 */
export function takeWhile<TToken, TOptions, TValue> (
  /**
   * A parser.
   */
  p: Parser<TToken, TOptions, TValue>,
  /**
   * Matched results are accumulated *while* the result of this function is `true`.
   *
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the current value matched).
   * @param j - Parser position in the tokens array (after the current value matched).
   */
  test: (value: TValue, n: number, data: Data<TToken, TOptions>, i: number, j: number) => boolean,
): Matcher<TToken, TOptions, TValue[]>;

export function takeWhile<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
  test: (value: TValue, n: number, data: Data<TToken, TOptions>, i: number, j: number) => boolean,
): Matcher<TToken, TOptions, TValue[]> {
  return (data, i): Match<TValue[]> => {
    const values: TValue[] = [];
    let success = true;
    do {
      const r = p(data, i);
      if (r.matched && test(r.value, values.length + 1, data, i, r.position)) {
        values.push(r.value);
        i = r.position;
      } else {
        success = false;
      }
    } while (success);
    return {
      matched: true,
      position: i,
      value: values,
    };
  };
}
