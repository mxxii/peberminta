import type { Data } from '../coreTypes/Data.ts';

/**
 * Utility function returning the number of tokens
 * that are not yet parsed (current token included).
 *
 * Useful when creating custom base parsers.
 *
 * Note: Can return a negative value if the supplied position
 * goes beyond the tokens array length for whatever reason.
 *
 * @param data - Data.
 * @param i - Current position.
 *
 * @category Utility functions
 */
export function remainingTokensNumber<TToken> (
  data: Data<TToken, unknown>, i: number,
): number {
  return data.tokens.length - i;
}
