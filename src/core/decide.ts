import { _mapOuter } from './coreUtils';
import { Parser } from './types';

/**
 * Make a parser that runs a given parser and then a dynamically returned parser.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Compared to {@link condition} this can have any complex logic inside.
 *
 * {@link chain} allows to reuse the first parser.
 *
 * @param p - A parser that returns another parser as a value.
 * If it consumes the input then the returned parser will be called with the new position.
 */
export function decide<TToken, TOptions, TValue>(
  p: Parser<TToken, TOptions, Parser<TToken, TOptions, TValue>>
): Parser<TToken, TOptions, TValue> {
  return (data, i) => _mapOuter(
    p(data, i),
    (m1) => m1.value(data, m1.position)
  );
}
