import { Matcher, Parser } from './types.ts';
import { ab, right } from './ab.ts';
import { emit } from './emit.ts';
import { many } from './many.ts';
import { otherwise } from './otherwise.ts';

/**
 * Make a parser that matches 1 or more values interleaved with separators.
 *
 * A nonmatch is returned if no single value was matched.
 *
 * Implementation is based on {@link ab}, {@link many} and {@link right}.
 *
 * @param pValue - A parser for values.
 * @param pSep - A parser for separators.
 */
export function sepBy1<TToken,TOptions,TValue,TSep> (
  pValue: Parser<TToken,TOptions,TValue>,
  pSep: Parser<TToken,TOptions,TSep>
): Parser<TToken,TOptions,[TValue,...TValue[]]> {
  return ab(
    pValue,
    many(right(pSep, pValue)),
    (head, tail) => [head, ...tail]
  );
}

/**
 * Make a {@link Matcher} that matches 0 or more values interleaved with separators.
 *
 * A match with an empty array is returned if no single value was matched.
 *
 * Implementation is based on {@link sepBy1}, {@link otherwise} and {@link emit}.
 *
 * @param pValue - A parser for values.
 * @param pSep - A parser for separators.
 */
export function sepBy<TToken,TOptions,TValue,TSep> (
  pValue: Parser<TToken,TOptions,TValue>,
  pSep: Parser<TToken,TOptions,TSep>
): Matcher<TToken,TOptions,TValue[]> {
  return otherwise(
    sepBy1(pValue, pSep),
    emit([] as TValue[])
  );
}
