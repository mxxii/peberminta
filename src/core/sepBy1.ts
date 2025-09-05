import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';
import { many } from './many.ts';
import { right } from './right.ts';

/**
 * Make a parser that matches 1 or more values interleaved with separators.
 *
 * A nonmatch is returned if no single value was matched.
 *
 * Implementation is based on {@link ab}, {@link many} and {@link right}.
 *
 * @param pValue - A parser for values.
 * @param pSep - A parser for separators.
 */
export function sepBy1<TToken, TOptions, TValue, TSep> (
  pValue: Parser<TToken, TOptions, TValue>,
  pSep: Parser<TToken, TOptions, TSep>,
): Parser<TToken, TOptions, [TValue, ...TValue[]]> {
  return ab(
    pValue,
    many(right(pSep, pValue)),
    (head, tail) => [head, ...tail],
  );
}
