import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';
import { reduceRight } from './reduceRight.ts';

/**
 * Make a parser that parses any number of values and operators, then one extra value
 * to combine in right-to-left (last-to-first) order.
 *
 * Use {@link rightAssoc1} if the grammar doesn't have an explicit operator between values.
 *
 * Implementation is based on {@link ab} and {@link reduceRight}.
 *
 * @param pLeft - A parser for each consecutive value.
 *
 * @param pOper - A parser for an operator function.
 *
 * @param pRight - A parser for the last value,
 * also defines the result type (accumulator).
 */
export function rightAssoc2<TToken, TOptions, TLeft, TRight> (
  pLeft: Parser<TToken, TOptions, TLeft>,
  pOper: Parser<TToken, TOptions, (x: TLeft, y: TRight) => TRight>,
  pRight: Parser<TToken, TOptions, TRight>,
): Parser<TToken, TOptions, TRight> {
  return ab(
    reduceRight(
      ab(
        pLeft,
        pOper,
        (x, f) => [x, f] as [TLeft, (x: TLeft, y: TRight) => TRight],
      ),
      (y: TRight) => y,
      ([x, f], acc) => y => f(x, acc(y)),
    ),
    pRight,
    (f, v) => f(v),
  );
}
