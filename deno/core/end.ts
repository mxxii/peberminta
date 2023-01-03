import { Data, Result } from './types.ts';

/**
 * Parser that matches only at the end of input.
 */
export function end<TToken, TOptions>(
  data: Data<TToken, TOptions>, i: number
): Result<true> {
  return (i < data.tokens.length)
    ? { matched: false }
    : {
      matched: true,
      position: i,
      value: true
    };
}
