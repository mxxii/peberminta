import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { eitherOr } from './eitherOr.ts';
import { emit } from './emit.ts';
import { sepBy1 } from './sepBy1.ts';

/**
 * Make a {@link Matcher} that matches 0 or more values interleaved with separators.
 *
 * A match with an empty array is returned if no single value was matched.
 *
 * Implementation is based on {@link eitherOr} , {@link sepBy1} and {@link emit}.
 *
 * @param pValue - A parser for values.
 * @param pSep - A parser for separators.
 */
export function sepBy<TToken, TOptions, TValue, TSep> (
  pValue: Parser<TToken, TOptions, TValue>,
  pSep: Parser<TToken, TOptions, TSep>,
): Matcher<TToken, TOptions, TValue[]> {
  return eitherOr(
    sepBy1(pValue, pSep),
    emit([]),
  );
}
