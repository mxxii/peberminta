import type { Parser } from '../coreTypes/Parser.ts';

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 * Returns `undefined` in case parser did not match.
 *
 * Note: this doesn't capture errors thrown during parsing.
 * Nonmatch is considered a part or normal flow.
 * Errors mean unrecoverable state and it's up to client code to decide
 * where to throw errors and how to get back to safe state.
 *
 * @param parser - A parser to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @returns A matched value or `undefined` in case of nonmatch.
 *
 * @category Utility functions
 */
export function tryParse<TToken, TOptions, TValue> (
  parser: Parser<TToken, TOptions, TValue>,
  tokens: TToken[],
  options: TOptions,
): TValue | undefined {
  const result = parser({ tokens: tokens, options: options }, 0);
  return (result.matched)
    ? result.value
    : undefined;
}
