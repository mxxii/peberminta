import { Matcher, Parser } from './types.ts';
import { _mapOuter } from './coreUtils.ts';

/**
 * This overload makes a {@link Matcher} that acts like a given one
 * but doesn't consume input.
 *
 * @param p - A matcher.
 */
export function ahead<TToken,TOptions,TValue> (
  p: Matcher<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue>;
/**
 * Make a parser that acts like a given one but doesn't consume input.
 *
 * @param p - A parser.
 */
export function ahead<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue>;
export function ahead<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue> {
  return (data, i) => _mapOuter(
    p(data, i),
    (m1) => ({
      matched: true,
      position: i,
      value: m1.value
    })
  );
}
