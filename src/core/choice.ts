import { Result, Parser } from './types';

/**
 * Make a parser that tries multiple parsers at the same position
 * and returns the first successful match
 * or a nonmatch if there was none.
 *
 * Combine with {@link otherwise} if you want to return a {@link Matcher}
 * or you have a limited number of parsers of different types.
 *
 * @param ps - Parsers to try.
 */


export function choice<TToken, TOptions, TValue>(
  ...ps: Parser<TToken, TOptions, TValue>[]
): Parser<TToken, TOptions, TValue> {
  return (data, i): Result<TValue> => {
    for (const p of ps) {
      const result = p(data, i);
      if (result.matched) {
        return result;
      }
    }
    return { matched: false };
  };
}
