import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';
import type { Result } from '../coreTypes/Result.ts';

/**
 * This overload makes a {@link Matcher} that tries multiple parsers (first entry is a matcher) at the same position
 * and returns the first successful match when trying them in reverse (last-to-first) order.
 *
 * Use {@link first} to try parsers in normal order.
 *
 * Use {@link longest} to choose the longest match.
 *
 * @param ps - Parsers to try.
 */
export function last<TToken, TOptions, TValue> (
  ...ps: [Matcher<TToken, TOptions, TValue>, ...Parser<TToken, TOptions, TValue>[]]
): Matcher<TToken, TOptions, TValue>;

/**
 * Make a parser that tries multiple parsers at the same position (in reverse order)
 * and returns the first successful match
 * or a nonmatch if there was none.
 *
 * Use {@link first} to try parsers in normal order.
 *
 * Use {@link longest} to choose the longest match.
 *
 * @param ps - Parsers to try.
 */
export function last<TToken, TOptions, TValue> (
  ...ps: Parser<TToken, TOptions, TValue>[]
): Parser<TToken, TOptions, TValue>;

export function last<TToken, TOptions, TValue> (
  ...ps: Parser<TToken, TOptions, TValue>[]
): Parser<TToken, TOptions, TValue> {
  return (data, i): Result<TValue> => {
    for (let j = ps.length - 1; j >= 0; j--) {
      const result = ps[j](data, i);
      if (result.matched) {
        return result;
      }
    }
    return { matched: false };
  };
}
