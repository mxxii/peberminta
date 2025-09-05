import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { takeWhile } from './takeWhile.ts';

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
export function takeUntilP<TToken, TOptions, TValue> (
  pValue: Parser<TToken, TOptions, TValue>,
  pTest: Parser<TToken, TOptions, unknown>,
): Matcher<TToken, TOptions, TValue[]> {
  return takeWhile(pValue, (value, n, data, i) => !pTest(data, i).matched);
}
