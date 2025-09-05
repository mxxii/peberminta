import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';

/**
 * This overload makes a {@link Matcher} that applies two matchers one after another
 * and returns the result from the first one.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First matcher (result is returned).
 * @param pb - Second matcher (result is discarded).
 */
export function left<TToken, TOptions, TValueA, TValueB> (
  pa: Matcher<TToken, TOptions, TValueA>,
  pb: Matcher<TToken, TOptions, TValueB>
): Matcher<TToken, TOptions, TValueA>;

/**
 * Make a parser that tries two parsers one after another
 * and returns the result from the first one if both matched.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First parser (result is returned).
 * @param pb - Second parser (result is discarded).
 */
export function left<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>
): Parser<TToken, TOptions, TValueA>;

export function left<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
): Parser<TToken, TOptions, TValueA> {
  return ab(pa, pb, va => va);
}
