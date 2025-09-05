import type { Parser } from '../coreTypes/Parser.ts';

/**
 * Make a parser that returns a Match without consuming input
 * in case the inner parser didn't match
 * and a NonMatch in case the inner parser matched.
 *
 * @param p - A parser.
 */
export function not<TToken, TOptions, TValue> (
  p: Parser<TToken, TOptions, TValue>,
): Parser<TToken, TOptions, true> {
  return (data, i) => {
    const r = p(data, i);
    return (r.matched)
      ? { matched: false }
      : {
          matched: true,
          position: i,
          value: true,
        };
  };
}
