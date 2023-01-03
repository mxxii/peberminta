import { Match, Result, Parser } from './types.ts';

/**
 * Make a parser that tries all provided parsers at the same position
 * and returns the longest successful match
 * or a nonmatch if there was none.
 *
 * If there are multiple matches of the same maximum length
 * then the first one of them is returned.
 *
 * Use {@link choice} to take the first match.
 *
 * @param ps - Parsers to try.
 */
export function longest<TToken, TOptions, TValue>(
  ...ps: Parser<TToken, TOptions, TValue>[]
): Parser<TToken, TOptions, TValue> {
  return (data, i): Result<TValue> => {
    let match: Match<TValue> | undefined = undefined;
    for (const p of ps) {
      const result = p(data, i);
      if (result.matched && (!match || match.position < result.position)) {
        match = result;
      }
    }
    return match || { matched: false };
  };
}
