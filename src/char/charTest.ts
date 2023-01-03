import { Parser, token } from '../core';

/**
 * Make a parser that matches input character against given regular expression.
 *
 * Use this to match characters belonging to a certain range
 * or having a certain [unicode property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes).
 *
 * Use `satisfy` from core module instead if you need a predicate.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param regex - Tester regular expression.
 */
export function charTest<TOptions>(
  regex: RegExp
): Parser<string, TOptions, string> {
  return token((c) => regex.test(c) ? c : undefined);
}
