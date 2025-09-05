import type { Parser } from '../coreTypes/Parser.ts';

/**
 * Make a parser that expects at least `min` and at most `max` sequential matches of the same parser.
 *
 * A nonmatch is returned if there are less than `min` matches.
 *
 * Does not consume more than `max` matches.
 *
 * Equivalent to {@link takeN} when `min` and `max` set to the same value - prefer using that.
 *
 * Equivalent to {@link many} when neither `min` nor `max` is set - prefer using that.
 *
 * @param p - A parser.
 * @param min - Minimum number of matches to take.
 * @param max - Maximum number of matches to take.
 */
export function takeMinMax<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
  min: number | undefined,
  max: number | undefined,
): Parser<TToken, TOptions, TValue[]> {
  return (data, i) => {
    const values: TValue[] = [];
    let j = i;
    for (let k = 0; k < (max ?? Infinity); k++) {
      const r = p(data, j);
      if (r.matched) {
        values.push(r.value);
        j = r.position;
      } else {
        break;
      }
    }
    if (min !== undefined && values.length < min) {
      return { matched: false };
    }
    return {
      matched: true,
      position: j,
      value: values,
    };
  };
}
