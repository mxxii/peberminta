import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { mapOuter } from './mapOuter.ts';

/**
 * This overload makes a {@link Matcher} that runs a given matcher and then a dynamically returned matcher.
 *
 * Compared to {@link condition} this can have any complex logic inside.
 *
 * Prefer to use {@link chain} - it splits the parser generation into a separate function, allowing for more modular code.
 *
 * @param p - A parser that returns another parser as a value.
 * If it consumes the input then the returned parser will be called with the new position.
 */
export function decide<TToken, TOptions, TValue> (
  p: Matcher<TToken, TOptions, Matcher<TToken, TOptions, TValue>>
): Matcher<TToken, TOptions, TValue>;

/**
 * Make a parser that runs a given parser and then a dynamically returned parser.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Compared to {@link condition} this can have any complex logic inside.
 *
 * {@link chain} splits the parser generation into a separate function, allowing for more modular code.
 *
 * @param p - A parser that returns another parser as a value.
 * If it consumes the input then the returned parser will be called with the new position.
 */
export function decide<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, Parser<TToken, TOptions, TValue>>
): Parser<TToken, TOptions, TValue>;

export function decide<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, Parser<TToken, TOptions, TValue>>,
): Parser<TToken, TOptions, TValue> {
  return (data, i) => mapOuter(
    p(data, i),
    m1 => m1.value(data, m1.position),
  );
}
