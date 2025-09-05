import type { Data } from '../coreTypes/Data.ts';
import type { Parser } from '../coreTypes/Parser.ts';

/**
 * Make a parser that tests a token with a given predicate and returns the token value unchanged.
 *
 * This overload uses a type guard predicate to narrow the token/value type on success.
 *
 * Use {@link token} instead if you want to transform the value.
 *
 * Use {@link filter} for testing a match from another parser instead of a token directly.
 */
export function satisfy<TToken1, TOptions, TToken2 extends TToken1> (
  /**
   * A test condition/predicate.
   *
   * @param token - A token at the parser position.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (points at the same token).
   */
  test: (token: TToken1, data: Data<TToken1, TOptions>, i: number) => token is TToken2,
): Parser<TToken1, TOptions, TToken2>;

/**
 * Make a parser that tests a token with a given predicate and returns the token value unchanged.
 *
 * Use {@link token} instead if you want to transform the value.
 *
 * Use {@link filter} for testing a match from another parser instead of a token directly.
 */
export function satisfy<TToken, TOptions> (
  /**
   * A test condition/predicate.
   *
   * @param token - A token at the parser position.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (points at the same token).
   */
  test: (token: TToken, data: Data<TToken, TOptions>, i: number) => boolean,
): Parser<TToken, TOptions, TToken>;

export function satisfy<TToken, TOptions> (
  test: (token: TToken, data: Data<TToken, TOptions>, i: number) => boolean,
): Parser<TToken, TOptions, TToken> {
  return (data, i) => (i < data.tokens.length && test(data.tokens[i], data, i))
    ? {
        matched: true,
        position: i + 1,
        value: data.tokens[i],
      }
    : { matched: false };
}
