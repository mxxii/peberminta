import { Data, Result } from './types.ts';

/**
 * Parser that matches any token value, consumes and returns it.
 *
 * Only fails when there are no more tokens.
 *
 * Use {@link token} instead if you intend to immediately transform the value.
 *
 * Use {@link satisfy} if there is a test condition but no transformation.
 */
export function any<TToken, TOptions>(
  data: Data<TToken, TOptions>, i: number
): Result<TToken> {
  return (i < data.tokens.length)
    ? {
      matched: true,
      position: i + 1,
      value: data.tokens[i]
    }
    : { matched: false };
}
