import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { many } from './many.ts';
import { map } from './map.ts';

/**
 * Make a {@link Matcher} that takes 0 or more matches from the same parser
 * and reduces them into one value in right-to-left (last-to-first) order.
 *
 * Note: accumulator is the right (second) argument.
 *
 * Use {@link rightAssoc1} if you have an initial value to be parsed after all matches.
 *
 * Implementation is based on {@link many} and {@link map}.
 */
export function reduceRight<TToken, TOptions, TValue, TAcc> (
  /**
   * Parser for each next value.
   */
  p: Parser<TToken, TOptions, TValue>,
  /**
   * Initial value for the accumulator.
   */
  acc: TAcc,
  /**
   * Function to combine the accumulator and each parsed value.
   *
   * @param v - Value from each successful parsing.
   * @param acc - Accumulated value.
   * @param data - Data object (tokens and options).
   * @param i - Position before all successful parsings.
   * @param j - Position after all successful parsings.
   */
  reducer: (v: TValue, acc: TAcc, data: Data<TToken, TOptions>, i: number, j: number) => TAcc,
): Matcher<TToken, TOptions, TAcc> {
  return map(
    many(p),
    (vs, data, i, j) => vs.reduceRight(
      (acc, v) => reducer(v, acc, data, i, j),
      acc,
    ),
  );
}
