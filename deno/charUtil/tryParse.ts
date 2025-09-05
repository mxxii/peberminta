import type { Parser } from '../core.ts';

import { tryParse as tryParseCore } from '../core.ts';

/**
 * Utility function that provides a bit cleaner interface
 * for running a parser over a string.
 * Returns `undefined` in case parser did not match.
 *
 * Input string is broken down to characters as `[...str]`
 * unless you provide a pre-split array.
 *
 * Note: this doesn't capture errors thrown during parsing.
 * Nonmatch is considered a part or normal flow.
 * Errors mean unrecoverable state and it's up to client code to decide
 * where to throw errors and how to get back to safe state.
 *
 * @param parser - A parser to run.
 * @param str - Input string or an array of graphemes.
 * @param options - Parser options.
 * @returns A matched value or `undefined` in case of nonmatch.
 *
 * @category Utility functions
 */
export function tryParse<TOptions, TValue> (
  parser: Parser<string, TOptions, TValue>,
  str: string | string[],
  options: TOptions,
): TValue | undefined {
  return tryParseCore(parser, [...str], options);
}
