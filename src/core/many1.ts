import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';
import { many } from './many.ts';

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
export function many1<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
): Parser<TToken, TOptions, [TValue, ...TValue[]]> {
  return ab(p, many(p), (head, tail) => [head, ...tail]);
}
