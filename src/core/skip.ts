import { all } from './all';
import { map } from './map';
import { Parser } from './types';

/**
 * Make a parser that runs all given parsers in sequence
 * and discards (skips) all results (Returns a match with a single `null` value).
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Implementation is based on {@link all} and {@link map}.
 *
 * This function only exists to make the intent clear.
 * Use in combination with {@link left}, {@link right} or other combinators
 * to make the `null` result disappear.
 *
 * @param ps - Parsers to run sequentially.
 */
export function skip<TToken, TOptions>(
  ...ps: Parser<TToken, TOptions, unknown>[]
): Parser<TToken, TOptions, unknown> {
  return map(all(...ps), () => null);
}
