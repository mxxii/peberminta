import { _mapOuter } from './coreUtils.ts';
import { Data, Parser } from './types.ts';

/**
 * Make a parser that runs a given parser,
 * passes the matched value into a parser-generating function
 * and then runs the returned parser.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Similar to {@link decide} in that it allows for complex logic.
 *
 * Use {@link condition} if there is no dependency on the value of the first parser.
 *
 * Combine with {@link chainReduce} to get a stack-safe chain of arbitrary length.
 *
 * @param p - A parser.
 * @param f - A function that returns a parser based on the input value.
 */
export function chain<TToken, TOptions, TValue1, TValue2>(
  p: Parser<TToken, TOptions, TValue1>,
  /**
   * @param v1 - A value from the first parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before the first parser matched).
   * @param j - Parser position in the tokens array (after the first parser matched).
   */
  f: (v1: TValue1, data: Data<TToken, TOptions>, i: number, j: number) => Parser<TToken, TOptions, TValue2>
): Parser<TToken, TOptions, TValue2> {
  return (data, i) => _mapOuter(
    p(data, i),
    (m1) => f(m1.value, data, i, m1.position)(data, m1.position)
  );
}
