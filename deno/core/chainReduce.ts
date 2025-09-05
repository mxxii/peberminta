import type { Data } from '../coreTypes/Data.ts';
import type { Matcher } from '../coreTypes/Matcher.ts';
import type { Parser } from '../coreTypes/Parser.ts';

/**
 * Make a {@link Matcher} that takes 0 or more matches from parsers
 * returned by provided parser-generating function.
 *
 * This is like a combination of {@link chain} and {@link reduceLeft}
 * (except the actual implementation is the other way around).
 *
 * Each next parser is made based on previously accumulated value,
 * parsing continues from left to right until first nonmatch.
 */
export function chainReduce<TToken, TOptions, TAcc> (
  /**
   * Initial value for the accumulator.
   */
  acc: TAcc,
  /**
   * A function that returns a parser based on previously accumulated value.
   *
   * @param acc - Accumulated value.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before each parser called).
   */
  f: (acc: TAcc, data: Data<TToken, TOptions>, i: number) => Parser<TToken, TOptions, TAcc>,
): Matcher<TToken, TOptions, TAcc> {
  return (data, i) => {
    let loop = true;
    let acc1 = acc;
    let pos = i;
    do {
      const r = f(acc1, data, pos)(data, pos);
      if (r.matched) {
        acc1 = r.value;
        pos = r.position;
      } else {
        loop = false;
      }
    } while (loop);
    return {
      matched: true,
      position: pos,
      value: acc1,
    };
  };
}
