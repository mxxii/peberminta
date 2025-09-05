import type { Data } from '../coreTypes/Data.ts';
import type { Parser } from '../coreTypes/Parser.ts';

import { parserPosition } from './parserPosition.ts';

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 *
 * This one throws an error in case parser didn't match
 * OR the match is incomplete (some part of tokens array left unparsed).
 *
 * @param parser - A parser to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @param formatToken - A function to stringify a token
 * (Defaults to `JSON.stringify`. For incomplete match error message).
 *
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function parse<TToken, TOptions, TValue> (
  parser: Parser<TToken, TOptions, TValue>,
  tokens: TToken[],
  options: TOptions,
  formatToken: (t: TToken) => string = JSON.stringify,
): TValue {
  const data: Data<TToken, TOptions> = { tokens: tokens, options: options };
  const result = parser(data, 0);
  if (!result.matched) {
    throw new Error('No match');
  }
  if (result.position < data.tokens.length) {
    throw new Error(
      `Partial match. Parsing stopped at:\n${parserPosition(data, result.position, formatToken)}`,
    );
  }
  return result.value;
}
