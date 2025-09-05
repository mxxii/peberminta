import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';

/**
 * This overload makes a {@link Matcher} that applies two matchers one after another
 * and returns the result from the second one.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First matcher (result is discarded).
 * @param pb - Second matcher (result is returned).
 */
export function right<TToken, TOptions, TValueA, TValueB> (
  pa: Matcher<TToken, TOptions, TValueA>,
  pb: Matcher<TToken, TOptions, TValueB>
): Matcher<TToken, TOptions, TValueB>;

/**
 * Make a parser that tries two parsers one after another
 * and returns the result from the second one if both matched.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First parser (result is discarded).
 * @param pb - Second parser (result is returned).
 */
export function right<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>
): Parser<TToken, TOptions, TValueB>;

export function right<TToken, TOptions, TValueA, TValueB> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
): Parser<TToken, TOptions, TValueB> {
  return ab(pa, pb, (va, vb) => vb);
}
