import { Data, Parser } from './types';
import { _mapInner, _mapOuter } from './coreUtils';

/**
 * Make a parser that tries two parsers one after another and joins the results.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Use {@link abc} if you want to join 3 different parsers.
 *
 * Use {@link left} or {@link right} if you want to keep one result and discard another.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 *
 * @param pa - First parser.
 * @param pb - Second parser.
 * @param join - A function to combine matched results from both parsers.
 */
export function ab<TToken,TOptions,TValueA,TValueB,TValue> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>,
  /**
   * @param va - A value matched by the first parser.
   * @param vb - A value matched by the second parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before both parsers matched).
   * @param j - Parser position in the tokens array (after both parsers matched).
   */
  join: (va: TValueA, vb: TValueB, data: Data<TToken,TOptions>, i: number, j: number) => TValue
): Parser<TToken,TOptions,TValue> {
  return (data, i) => _mapOuter(
    pa(data, i),
    (ma) => _mapInner(
      pb(data, ma.position),
      (vb, j) => join(ma.value, vb, data, i, j)
    )
  );
}

/**
 * Make a parser that tries two parsers one after another
 * and returns the result from the first one if both matched.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First parser (result is returned).
 * @param pb - Second parser (result is discarded).
 */
export function left<TToken,TOptions,TValueA,TValueB> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>
): Parser<TToken,TOptions,TValueA> {
  return ab(pa, pb, (va) => va);
}

/**
 * Make a parser that tries two parsers one after another
 * and returns the result from the second one if both matched.
 *
 * A nonmatch is returned if any of two parsers did not match.
 *
 * Implementation is based on {@link ab}.
 *
 * @param pa - First parser (result is discarded).
 * @param pb - Second parser (result is returned).
 */
export function right<TToken,TOptions,TValueA,TValueB> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>
): Parser<TToken,TOptions,TValueB> {
  return ab(pa, pb, (va, vb) => vb);
}
