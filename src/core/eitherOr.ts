import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

/**
 * This overload makes a {@link Matcher} from a parser and a matcher.
 * If the parser matched - return the match,
 * otherwise return the match from the matcher.
 *
 * Can be used to keep the matcher type when you have multiple parsing options
 * and the last one always matches.
 *
 * Combine with {@link choice} if you need multiple alternative parsers of the same value type.
 *
 * Nest calls to have union of more than two different value types derived automatically.
 *
 * Use {@link option} if you just want a constant alternative value
 * without consuming input.
 *
 * @param pa - A parser.
 * @param pb - A matcher that is only called if the parser didn't match.
 */
export function eitherOr<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Matcher<TToken, TOptions, TValueB>
): Matcher<TToken, TOptions, TValueA | TValueB>;

/**
 * Make a parser that tries two parsers at the same position
 * and returns the first successful match
 * or a nonmatch if there was none.
 *
 * Use this if you want to combine parsers of different value types.
 *
 * Nest calls to have more than two different value types.
 *
 * Use {@link choice} if you have parsers of the same value type.
 *
 * @param pa - A parser that is tried first.
 * @param pb - A parser that is only tried if the first one didn't match.
 */
export function eitherOr<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>
): Parser<TToken, TOptions, TValueA | TValueB>;

export function eitherOr<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
): Parser<TToken, TOptions, TValueA | TValueB> {
  return (data, i) => {
    const r1 = pa(data, i);
    return (r1.matched)
      ? r1
      : pb(data, i);
  };
}
