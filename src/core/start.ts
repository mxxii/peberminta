import { Data, Result } from './types';

/**
 * Parser that matches only at the beginning and doesn't consume input.
 */
export function start<TToken, TOptions>(
  data: Data<TToken, TOptions>, i: number
): Result<true> {
  return (i !== 0)
    ? { matched: false }
    : {
      matched: true,
      position: i,
      value: true
    };
}
