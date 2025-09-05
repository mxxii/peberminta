import type { Matcher } from '../core.ts';

import { match as matchCore } from '../core.ts';

/**
 * Utility function that provides a bit cleaner interface
 * for running a {@link Matcher} over a string.
 *
 * Input string is broken down to characters as `[...str]`
 * unless you provide a pre-split array.
 *
 * @param matcher - A matcher to run.
 * @param str - Input string or an array of graphemes.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function match<TOptions, TValue> (
  matcher: Matcher<string, TOptions, TValue>,
  str: string | string[],
  options: TOptions,
): TValue {
  return matchCore(matcher, [...str], options);
}
