import type { Parser } from '../coreTypes/Parser.ts';

import { ab } from './ab.ts';
import { reduceRight } from './reduceRight.ts';

/**
 * Make a parser that parses any number of values and then one extra value
 * to combine in right-to-left (last-to-first) order.
 *
 * Note: This can fail if `pOper` and `pRight` can consume same tokens.
 * You'll have to make an {@link ahead} guard to prevent it from consuming the last token.
 *
 * Use {@link rightAssoc2} if the grammar has an explicit operator between values.
 *
 * Implementation is based on {@link ab} and {@link reduceRight}.
 *
 * @param pOper - A parser for each consecutive value.
 * Result type is a transformation operation for the accumulator.
 *
 * @param pRight - A parser for the last value,
 * also defines the result type (accumulator).
 */
export function rightAssoc1<TToken, TOptions, TRight> (
  pOper: Parser<TToken, TOptions, (y: TRight) => TRight>,
  pRight: Parser<TToken, TOptions, TRight>,
): Parser<TToken, TOptions, TRight> {
  return ab(
    reduceRight(
      pOper,
      (y: TRight) => y,
      (f, acc) => y => f(acc(y)),
    ),
    pRight,
    (f, v) => f(v),
  );
}
