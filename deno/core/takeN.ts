import type { Parser } from '../coreTypes/Parser.ts';
import type { Result } from '../coreTypes/Result.ts';
import type { TupleOf } from '../coreTypes/TupleOf.ts';

/**
 * Make a parser that expects exactly `n` sequential matches of the same parser.
 *
 * A nonmatch is returned if there are not enough matches.
 *
 * Use {@link takeMinMax} if the number of matches is defined by a range.
 *
 * @param p - A parser.
 * @param n - Number of matches to take.
 */
export function takeN<TToken, TOptions, TValue, N extends number> (
  p: Parser<TToken, TOptions, TValue>,
  n: N,
): Parser<TToken, TOptions, TupleOf<TValue, N>> {
  return (data, i): Result<TupleOf<TValue, N>> => {
    const values: TValue[] = [];
    let j = i;
    for (let k = 0; k < n; k++) {
      const r = p(data, j);
      if (r.matched) {
        values.push(r.value);
        j = r.position;
      } else {
        return { matched: false };
      }
    }
    return {
      matched: true,
      position: j,
      value: values as TupleOf<TValue, N>,
    };
  };
}
