import { Data, Parser } from './types';
import { _mapInner, _mapOuter } from './coreUtils';

/**
 * Make a parser that tries three parsers one after another and joins the results.
 *
 * A nonmatch is returned if any of three parsers did not match.
 *
 * Use {@link ab} if you want to join just 2 different parsers.
 *
 * Use {@link middle} if you want to keep only the middle result and discard two others.
 *
 * Use {@link all} if you want a sequence of parsers of arbitrary length (but they have to share a common value type).
 *
 * @param pa - First parser.
 * @param pb - Second parser.
 * @param pc - Third parser.
 * @param join - A function to combine matched results from all three parsers.
 */
export function abc<TToken,TOptions,TValueA,TValueB,TValueC,TValue> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>,
  pc: Parser<TToken,TOptions,TValueC>,
  /**
   * @param va - A value matched by the first parser.
   * @param vb - A value matched by the second parser.
   * @param vc - A value matched by the third parser.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before all three parsers matched).
   * @param j - Parser position in the tokens array (after all three parsers matched).
   */
  join: (va: TValueA, vb: TValueB, vc: TValueC, data: Data<TToken,TOptions>, i: number, j: number) => TValue
): Parser<TToken,TOptions,TValue> {
  return (data, i) => _mapOuter(
    pa(data, i),
    (ma) => _mapOuter(
      pb(data, ma.position),
      (mb) => _mapInner(
        pc(data, mb.position),
        (vc, j) => join(ma.value, mb.value, vc, data, i, j)
      )
    )
  );
}

/**
 * Make a parser that tries three parsers one after another
 * and returns the middle result if all three matched.
 *
 * A nonmatch is returned if any of three parsers did not match.
 *
 * Implementation is based on {@link abc}.
 *
 * @param pa - First parser (result is discarded).
 * @param pb - Second parser (result is returned).
 * @param pc - Third parser (result is discarded).
 */
export function middle<TToken,TOptions,TValueA,TValueB,TValueC> (
  pa: Parser<TToken,TOptions,TValueA>,
  pb: Parser<TToken,TOptions,TValueB>,
  pc: Parser<TToken,TOptions,TValueC>
): Parser<TToken,TOptions,TValueB> {
  return abc(
    pa,
    pb,
    pc,
    (ra, rb) => rb
  );
}
