import type { Parser } from '../coreTypes/Parser.ts';

import { chain } from './chain.ts';
import { reduceLeft } from './reduceLeft.ts';

/**
 * Make a parser that parses one value and any number of following values
 * to combine with the first one in left-to-right (first-to-last) order.
 *
 * Use {@link leftAssoc2} if the grammar has an explicit operator between values.
 *
 * Implementation is based on {@link chain} and {@link reduceLeft}.
 *
 * @param pLeft - A parser for the first value,
 * also defines the result type (accumulator).
 *
 * @param pOper - A parser for each consecutive value.
 * Result type is a transformation operation for the accumulator.
 */
export function leftAssoc1<TToken, TOptions, TLeft> (
  pLeft: Parser<TToken, TOptions, TLeft>,
  pOper: Parser<TToken, TOptions, (x: TLeft) => TLeft>,
): Parser<TToken, TOptions, TLeft> {
  return chain(
    pLeft,
    v0 => reduceLeft(
      v0,
      pOper,
      (acc, f) => f(acc),
    ),
  );
}
