import { Data, Parser } from './types';

/**
 * Make a parser that chooses between two given parsers based on a condition.
 * This makes possible to allow/disallow a grammar based on context/options.
 *
 * {@link decide} and {@link chain} allow for more complex dynamic rules.
 *
 * @param cond - Condition.
 * @param pTrue - Parser to run when the condition is true.
 * @param pFalse - Parser to run when the condition is false.
 */
export function condition<TToken, TOptions, TValue>(
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before parsing).
   */
  cond: (data: Data<TToken, TOptions>, i: number) => boolean,
  pTrue: Parser<TToken, TOptions, TValue>,
  pFalse: Parser<TToken, TOptions, TValue>
): Parser<TToken, TOptions, TValue> {
  return (data, i) => (cond(data, i))
    ? pTrue(data, i)
    : pFalse(data, i);
}
