import type { Data, Parser } from '../core.ts';

import { parserPosition } from './parserPosition.ts';

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 *
 * This one throws an error in case parser didn't match
 * OR the match is incomplete (some part of input string left unparsed).
 *
 * Input string is broken down to characters as `[...str]`
 * unless you provide a pre-split array.
 *
 * @param parser - A parser to run.
 * @param str - Input string or an array of graphemes.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function parse<TOptions, TValue> (
  parser: Parser<string, TOptions, TValue>,
  str: string | string[],
  options: TOptions,
): TValue {
  const data: Data<string, TOptions> = { tokens: [...str], options: options };
  const result = parser(data, 0);
  if (!result.matched) {
    throw new Error('No match');
  }
  if (result.position < data.tokens.length) {
    throw new Error(
      `Partial match. Parsing stopped at:\n${parserPosition(data, result.position)}`,
    );
  }
  return result.value;
}
