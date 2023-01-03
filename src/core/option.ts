import { Parser, Matcher } from './types';

/**
 * Make a {@link Matcher} that returns either a match from a given parser
 * or a match with the default value (without consuming input in that case).
 *
 * Use {@link otherwise} if you want to provide a {@link Matcher}
 * instead of a constant default value.
 *
 * @param p - A parser.
 * @param def - Default value to be returned in case parser didn't match.
 */
export function option<TToken, TOptions, TValue>(
  p: Parser<TToken, TOptions, TValue>,
  def: TValue
): Matcher<TToken, TOptions, TValue> {
  return (data, i) => {
    const r = p(data, i);
    return (r.matched)
      ? r
      : {
        matched: true,
        position: i,
        value: def
      };
  };
}
