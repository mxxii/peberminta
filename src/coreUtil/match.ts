import type { Matcher } from '../coreTypes/Matcher.ts';

/**
 * Utility function that provides a bit cleaner interface for running a {@link Matcher}.
 *
 * @param matcher - A matcher to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function match<TToken, TOptions, TValue> (
  matcher: Matcher<TToken, TOptions, TValue>,
  tokens: TToken[],
  options: TOptions,
): TValue {
  const result = matcher({ tokens: tokens, options: options }, 0);
  return result.value;
}
