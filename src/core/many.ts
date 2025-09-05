import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { takeWhile } from './takeWhile.ts';

/**
 * Make a {@link Matcher} that returns all (0 or more) sequential matches of the same given parser.
 *
 * A match with empty array is produced if no single match was found.
 *
 * Use {@link many1} if at least one match is required.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param p - A parser to apply repeatedly.
 */
export function many<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
): Matcher<TToken, TOptions, TValue[]> {
  return takeWhile(p, () => true);
}
