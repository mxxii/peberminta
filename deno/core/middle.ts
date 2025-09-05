import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { abc } from './abc.ts';

/**
 * This overload makes a {@link Matcher} that applies three matchers one after another
 * and returns the middle result.
 *
 * Implementation is based on {@link abc}.
 *
 * @param pa - First matcher (result is discarded).
 * @param pb - Second matcher (result is returned).
 * @param pc - Third matcher (result is discarded).
 */
export function middle<TToken, TOptions, TValueA, TValueB, TValueC> (
  pa: Matcher<TToken, TOptions, TValueA>,
  pb: Matcher<TToken, TOptions, TValueB>,
  pc: Matcher<TToken, TOptions, TValueC>
): Matcher<TToken, TOptions, TValueB>;

/**
 * Make a parser that tries three parsers one after another
 * and returns the middle result if all three matched.
 *
 * A nonmatch is returned if any of three parsers did not match.
 *
 * Implementation is based on {@link abc}.
 *
 * @param pa - First parser (result is discarded).
 * @param pb - Second parser (result is returned).
 * @param pc - Third parser (result is discarded).
 */
export function middle<TToken, TOptions, TValueA, TValueB, TValueC> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
  pc: Parser<TToken, TOptions, TValueC>
): Parser<TToken, TOptions, TValueB>;

export function middle<TToken, TOptions, TValueA, TValueB, TValueC> (
  pa: Parser<TToken, TOptions, TValueA>,
  pb: Parser<TToken, TOptions, TValueB>,
  pc: Parser<TToken, TOptions, TValueC>,
): Parser<TToken, TOptions, TValueB> {
  return abc(
    pa,
    pb,
    pc,
    (ra, rb) => rb,
  );
}
