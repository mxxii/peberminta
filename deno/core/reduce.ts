import { Data, Matcher, Parser } from './types.ts';
import { ab } from './ab.ts';
import { chain } from './chain.ts';
import { many } from './many.ts';
import { map } from './map.ts';

/**
 * Make a {@link Matcher} that takes 0 or more matches from parsers
 * returned by provided parser-generating function.
 *
 * This is like a combination of {@link chain} and {@link reduceLeft}.
 * Each next parser is made based on previously accumulated value,
 * parsing continues from left to right until first nonmatch.
 *
 * @param acc - Initial value for the accumulator.
 * @param f - A function that returns a parser based on previously accumulated value.
 */
export function chainReduce<TToken,TOptions,TAcc> (
  acc: TAcc,
  /**
   * @param acc - Accumulated value.
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array (before each parser called).
   */
  f: (acc: TAcc, data: Data<TToken, TOptions>, i: number) => Parser<TToken, TOptions, TAcc>
): Matcher<TToken,TOptions,TAcc> {
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
      value: acc1
    };
  };
}

/**
 * Make a {@link Matcher} that takes 0 or more matches from the same parser
 * and reduces them into one value in left-to-right (first-to-last) order.
 *
 * Note: accumulator is the left (first) argument.
 *
 * Use {@link leftAssoc1} if you have an initial value to be parsed first.
 *
 * Implementation is based on {@link chainReduce} and {@link map}.
 *
 * @param acc - Initial value for the accumulator.
 * @param p - Parser for each next value.
 * @param reducer - Function to combine the accumulator and each parsed value.
 */
export function reduceLeft<TToken,TOptions,TAcc,TValue> (
  acc: TAcc,
  p: Parser<TToken,TOptions,TValue>,
  /**
   * @param acc - Accumulated value.
   * @param v - Value from each successful parsing.
   * @param data - Data object (tokens and options).
   * @param i - Position before current match.
   * @param j - Position after current match.
   */
  reducer: (acc: TAcc, v: TValue, data: Data<TToken,TOptions>, i: number, j: number) => TAcc
): Matcher<TToken,TOptions,TAcc> {
  return chainReduce(
    acc,
    (acc) => map(p, (v, data, i, j) => reducer(acc, v, data, i, j))
  );
}

/**
 * Make a {@link Matcher} that takes 0 or more matches from the same parser
 * and reduces them into one value in right-to-left (last-to-first) order.
 *
 * Note: accumulator is the right (second) argument.
 *
 * Use {@link rightAssoc1} if you have an initial value to be parsed after all matches.
 *
 * Implementation is based on {@link many} and {@link map}.
 *
 * @param p - Parser for each next value.
 * @param acc - Initial value for the accumulator.
 * @param reducer - Function to combine the accumulator and each parsed value.
 */
export function reduceRight<TToken,TOptions,TValue,TAcc> (
  p: Parser<TToken,TOptions,TValue>,
  acc: TAcc,
  /**
   * @param v - Value from each successful parsing.
   * @param acc - Accumulated value.
   * @param data - Data object (tokens and options).
   * @param i - Position before all successful parsings.
   * @param j - Position after all successful parsings.
   */
  reducer: (v: TValue, acc: TAcc, data: Data<TToken,TOptions>, i: number, j: number) => TAcc
): Matcher<TToken,TOptions,TAcc> {
  return map(
    many(p),
    (vs, data, i, j) => vs.reduceRight(
      (acc, v) => reducer(v, acc, data, i, j),
      acc
    )
  );
}

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
export function leftAssoc1<TToken,TOptions,TLeft> (
  pLeft: Parser<TToken,TOptions,TLeft>,
  pOper: Parser<TToken,TOptions,(x: TLeft) => TLeft>
): Parser<TToken,TOptions,TLeft> {
  return chain(
    pLeft,
    (v0) => reduceLeft(
      v0,
      pOper,
      (acc,f) => f(acc)
    )
  );
}

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
export function rightAssoc1<TToken,TOptions,TRight> (
  pOper: Parser<TToken,TOptions,(y: TRight) => TRight>,
  pRight: Parser<TToken,TOptions,TRight>
): Parser<TToken,TOptions,TRight> {
  return ab(
    reduceRight(
      pOper,
      (y: TRight) => y,
      (f,acc) => (y) => f(acc(y))
    ),
    pRight,
    (f,v) => f(v)
  );
}

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
export function leftAssoc2<TToken,TOptions,TLeft,TRight> (
  pLeft: Parser<TToken,TOptions,TLeft>,
  pOper: Parser<TToken,TOptions,(x: TLeft, y: TRight) => TLeft>,
  pRight: Parser<TToken,TOptions,TRight>
): Parser<TToken,TOptions,TLeft> {
  return chain(
    pLeft,
    (v0) => reduceLeft(
      v0,
      ab(
        pOper,
        pRight,
        (f,y) => [f,y] as [(x: TLeft, y: TRight) => TLeft, TRight]
      ),
      (acc,[f,y]) => f(acc, y)
    )
  );
}

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
export function rightAssoc2<TToken,TOptions,TLeft,TRight> (
  pLeft: Parser<TToken,TOptions,TLeft>,
  pOper: Parser<TToken,TOptions,(x: TLeft, y: TRight) => TRight>,
  pRight: Parser<TToken,TOptions,TRight>
): Parser<TToken,TOptions,TRight> {
  return ab(
    reduceRight(
      ab(
        pLeft,
        pOper,
        (x,f) => [x,f] as [TLeft, (x: TLeft, y: TRight) => TRight]
      ),
      (y: TRight) => y,
      ([x,f],acc) => (y) => f(x, acc(y))
    ),
    pRight,
    (f,v) => f(v)
  );
}
