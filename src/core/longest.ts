import type { Match } from '../coreTypes/Match.ts';
import type { Parser } from '../coreTypes/Parser.ts';
import type { Result } from '../coreTypes/Result.ts';

/**
 * Make a parser that tries all provided parsers at the same position
 * and returns the longest successful match
 * or a nonmatch if there was none.
 *
 * If there are multiple matches of the same maximum length
 * then the first one of them is returned.
 *
 * Use {@link first} to try parsers in normal order and return the first match.
 *
 * Use {@link last} to try parsers in reverse order.
 *
 * @param ps - Parsers to try.
 */
export function longest<TToken, TOptions, TValue> (
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
