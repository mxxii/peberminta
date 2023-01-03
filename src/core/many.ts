import { Matcher, Parser } from './types';
import { ab } from './ab';
import { takeWhile } from './take';

/**
 * Make a {@link Matcher} that returns all (0 or more) sequential matches of the same given parser.
 *
 * A match with empty array is produced if no single match was found.
 *
 * Use {@link many1} if at least one match is required.
 *
 * Implementation is based on {@link takeWhile}.
 *
 * @param p - A parser to apply repeatedly.
 */
export function many<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue[]> {
  return takeWhile(p, () => true);
}

/**
 * Make a parser that returns all (1 or more) sequential matches of the same parser.
 *
 * A nonmatch is returned if no single match was found.
 *
 * Use {@link many} in case zero matches are allowed.
 *
 * Implementation is based on {@link ab} and {@link many}.
 *
 * @param p - A parser to apply repeatedly.
 */
export function many1<TToken,TOptions,TValue> (
  p: Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,[TValue,...TValue[]]> {
  return ab(p, many(p), (head, tail) => [head, ...tail]);
}
