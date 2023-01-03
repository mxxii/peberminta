import { Parser, map, flatten } from '../core';

/**
 * Make a parser that concatenates characters/strings
 * from all provided parsers into a single string.
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * @param ps - Parsers sequence.
 * Each parser can return a string or an array of strings.
 */
export function concat<TOptions>(
  ...ps: Parser<string, TOptions, string | string[]>[]
): Parser<string, TOptions, string> {
  return map(
    flatten(...ps),
    (vs) => vs.join('')
  );
}
