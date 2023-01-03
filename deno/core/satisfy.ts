import { Data, Parser } from './types.ts';

/**
 * Make a parser that tests a token with a given predicate and returns it.
 *
 * Use {@link token} instead if you want to transform the value.
 *
 * @param test - A test condition/predicate.
 */
export function satisfy<TToken, TOptions>(
  /**
   * @param token - A token at the parser position.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (points at the same token).
   */
  test: (token: TToken, data: Data<TToken, TOptions>, i: number) => boolean
): Parser<TToken, TOptions, TToken> {
  return (data, i) => (i < data.tokens.length && test(data.tokens[i], data, i))
    ? {
      matched: true,
      position: i + 1,
      value: data.tokens[i]
    }
    : { matched: false };
}
