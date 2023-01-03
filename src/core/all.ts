import { Parser } from './types';

/**
 * Make a parser that runs all given parsers one after another
 * and returns all results in an array.
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * Use {@link ab} or {@link abc} if you need a limited number of parsers of different types.
 *
 * @param ps - Parsers to run sequentially.
 */
export function all<TToken, TOptions, TValue>(
  ...ps: Parser<TToken, TOptions, TValue>[]
): Parser<TToken, TOptions, TValue[]> {
  return (data, i) => {
    const result: TValue[] = [];
    let position = i;
    for (const p of ps) {
      const r1 = p(data, position);
      if (r1.matched) {
        result.push(r1.value);
        position = r1.position;
      } else {
        return { matched: false };
      }
    }
    return {
      matched: true,
      position: position,
      value: result
    };
  };
}
