import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { chainReduce } from './chainReduce.ts';
import { map } from './map.ts';

/**
 * Make a {@link Matcher} that takes 0 or more matches from the same parser
 * and reduces them into one value in left-to-right (first-to-last) order.
 *
 * Note: accumulator is the left (first) argument.
 *
 * Use {@link leftAssoc1} if you have an initial value to be parsed first.
 *
 * Implementation is based on {@link chainReduce} and {@link map}.
 */
export function reduceLeft<TToken, TOptions, TAcc, TValue> (
  /**
   * Initial value for the accumulator.
   */
  acc: TAcc,
  /**
   * Parser for each next value.
   */
  p: Parser<TToken, TOptions, TValue>,
  /**
   * Function to combine the accumulator and each parsed value.
   *
   * @param acc - Accumulated value.
   * @param v - Value from each successful parsing.
   * @param data - Data object (tokens and options).
   * @param i - Position before current match.
   * @param j - Position after current match.
   */
  reducer: (acc: TAcc, v: TValue, data: Data<TToken, TOptions>, i: number, j: number) => TAcc,
): Matcher<TToken, TOptions, TAcc> {
  return chainReduce(
    acc,
    acc => map(p, (v, data, i, j) => reducer(acc, v, data, i, j)),
  );
}
