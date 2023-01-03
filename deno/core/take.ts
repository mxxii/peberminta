import { Data, Match, Parser, Matcher } from './types.ts';

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the same given parser *while* the test function
 * equates to `true`.
 *
 * Use {@link many} if there is no stop condition.
 *
 * Use {@link takeWhileP} if the stop condition is expressed as a parser.
 *
 * @param p - A parser.
 * @param test - Matched results are accumulated *while* the result of this function is `true`.
 */
export function takeWhile<TToken, TOptions, TValue>(
  p: Parser<TToken, TOptions, TValue>,
  /**
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the current value matched).
   * @param j - Parser position in the tokens array (after the current value matched).
   */
  test: (value: TValue, n: number, data: Data<TToken, TOptions>, i: number, j: number) => boolean
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
      value: values
    };
  };
}

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
 *
 * @param p - A parser.
 * @param test - Matched results are accumulated *until* the result of this function is `true`.
 */
export function takeUntil<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>,
  /**
   * @param value - Current value matched by the parser.
   * @param n - Number of matches so far (including the current value).
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the current value matched).
   * @param j - Parser position in the tokens array (after the current value matched).
   */
  test: (value: TValue, n: number, data: Data<TToken,TOptions>, i: number, j: number) => boolean
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(p, (value, n, data, i, j) => !test(value, n, data, i, j));
}

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the first parser *while* the second parser also matches.
 *
 * Use {@link takeWhile} if the stop condition is based on the parsed value.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param pValue - A parser that produces result values.
 * @param pTest - A parser that serves as a stop condition.
 */
export function takeWhileP<TToken,TOptions,TValue> (
  pValue: Parser<TToken,TOptions,TValue>,
  pTest: Parser<TToken,TOptions,unknown>
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(pValue, (value, n, data, i) => pTest(data, i).matched);
}

/**
 * Make a {@link Matcher} that returns all (0 or more)
 * sequential matches of the first parser *while* the second parser does not match
 * (that is *until* the second parser matches).
 *
 * Use {@link takeUntil} if the stop condition is based on the parsed value.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param pValue - A parser that produces result values.
 * @param pTest - A parser that serves as a stop condition.
 */
export function takeUntilP<TToken,TOptions,TValue> (
  pValue: Parser<TToken,TOptions,TValue>,
  pTest: Parser<TToken,TOptions,unknown>
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(pValue, (value, n, data, i) => !pTest(data, i).matched);
}
