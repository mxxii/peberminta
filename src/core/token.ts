import type { Data } from '../coreTypes/Data.ts';
import type { Parser } from '../coreTypes/Parser.ts';

/**
 * Make a parser based on a token-to-value function.
 *
 * Nonmatch is produced if `undefined` value is returned by a function or if there are no tokens left.
 *
 * Use {@link make} if you want to produce a value without consuming a token.
 *
 * You can use {@link satisfy} if you just want to test but not transform the value.
 */
export function token<TToken, TOptions, TValue> (
  /**
   * Function that either transforms a token to a result value or returns `undefined`.
   *
   * @param token - A token at the parser position.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (points at the same token).
   */
  onToken: (token: TToken, data: Data<TToken, TOptions>, i: number) => TValue | undefined,
  /**
   * Optional function to be called if there are no tokens left. It can be used to throw an error when required token is missing.
   *
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (naturally points after the end of array).
   */
  onEnd?: (data: Data<TToken, TOptions>, i: number) => void,
): Parser<TToken, TOptions, TValue> {
  return (data, i) => {
    let position = i;
    let value: TValue | undefined = undefined;
    if (i < data.tokens.length) {
      value = onToken(data.tokens[i], data, i);
      if (value !== undefined) { position++; }
    } else {
      onEnd?.(data, i);
    }
    return (value === undefined)
      ? { matched: false }
      : {
          matched: true,
          position: position,
          value: value,
        };
  };
}
