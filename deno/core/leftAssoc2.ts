import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';
import { chain } from './chain.ts';
import { reduceLeft } from './reduceLeft.ts';

/**
 * Make a parser that parses one value and any number of following operators and values
 * to combine with the first one in left-to-right (first-to-last) order.
 *
 * Use {@link leftAssoc1} if the grammar doesn't have an explicit operator between values.
 *
 * Implementation is based on {@link chain}, {@link reduceLeft} and {@link ab}.
 *
 * @param pLeft - A parser for the first value,
 * also defines the result type (accumulator).
 *
 * @param pOper - A parser for an operator function.
 *
 * @param pRight - A parser for each consecutive value.
 */
export function leftAssoc2<TToken, TOptions, TLeft, TRight> (
  pLeft: Parser<TToken, TOptions, TLeft>,
  pOper: Parser<TToken, TOptions, (x: TLeft, y: TRight) => TLeft>,
  pRight: Parser<TToken, TOptions, TRight>,
): Parser<TToken, TOptions, TLeft> {
  return chain(
    pLeft,
    v0 => reduceLeft(
      v0,
      ab(
        pOper,
        pRight,
        (f, y) => [f, y] as [(x: TLeft, y: TRight) => TLeft, TRight],
      ),
      (acc, [f, y]) => f(acc, y),
    ),
  );
}
