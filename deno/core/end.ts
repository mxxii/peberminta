import type { Data } from '../coreTypes/Data.ts';
import type { Result } from '../coreTypes/Result.ts';

/**
 * Parser that matches only at the end of input.
 *
 * Inverse of {@link any}.
 */
export function end<TToken, TOptions> (
  data: Data<TToken, TOptions>, i: number,
): Result<true> {
  return (i < data.tokens.length)
    ? { matched: false }
    : {
        matched: true,
        position: i,
        value: true,
      };
}
