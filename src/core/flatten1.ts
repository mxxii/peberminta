import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { map } from './map.ts';

/**
 * This overload makes a {@link Matcher} that flattens an array
 * of values or value arrays returned by a given Matcher.
 *
 * Implementation is based on {@link map}.
 *
 * @param p - A matcher.
 */
export function flatten1<TToken, TOptions, TValue> (
  p: Matcher<TToken, TOptions, (TValue | TValue[])[]>
): Matcher<TToken, TOptions, TValue[]>;

/**
 * Make a parser that flattens an array of values or value arrays
 * returned by a given parser.
 *
 * Implementation is based on {@link map}.
 *
 * @param p - A parser.
 */
export function flatten1<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, (TValue | TValue[])[]>
): Parser<TToken, TOptions, TValue[]>;

export function flatten1<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, (TValue | TValue[])[]>,
): Parser<TToken, TOptions, TValue[]> {
  return map(
    p,
    vs => vs.flatMap(v => v),
  );
}
