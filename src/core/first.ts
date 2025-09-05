import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';
import type { Result } from '../coreTypes/Result.ts';

/**
 * This overload makes a {@link Matcher} that tries multiple parsers (last entry is a matcher) at the same position
 * and returns the first successful match.
 *
 * Use {@link last} to try parsers in reverse order.
 *
 * Use {@link longest} to choose the longest match.
 *
 * @param ps - Parsers to try.
 */
export function first<TToken, TOptions, TValue> (
  ...ps: [...Parser<TToken, TOptions, TValue>[], Matcher<TToken, TOptions, TValue>]
): Matcher<TToken, TOptions, TValue>;

/**
 * Make a parser that tries multiple parsers at the same position
 * and returns the first successful match
 * or a nonmatch if there was none.
 *
 * Use {@link last} to try parsers in reverse order.
 *
 * Use {@link longest} to choose the longest match.
 *
 * @param ps - Parsers to try.
 */
export function first<TToken, TOptions, TValue> (
  ...ps: Parser<TToken, TOptions, TValue>[]
): Parser<TToken, TOptions, TValue>;

export function first<TToken, TOptions, TValue> (
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
