import type { Parser } from '../core.ts';

import { satisfy } from '../core.ts';

/**
 * Make a parser that uses regular expressions
 * to match/non-match characters belonging to a certain range
 * or having a certain [unicode property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes).
 *
 * Provide a `positive` expression to accept only characters that satisfy it.
 * Provide a `negative` expression to reject characters that satisfy it.
 * If both are given a character must match `positive` (when provided) AND must NOT match `negative` (when provided).
 *
 * At least one of the arguments must be provided (throws otherwise).
 *
 * Use `satisfy` from core module instead if you need an arbitrary predicate.
 *
 * Tokens expected to be individual characters / graphemes.
 *
 * @param positive - Regular expression that must match (optional).
 * @param negative - Regular expression that must not match (optional).
 */
export function charTest<TOptions> (
  positive: RegExp | undefined,
  negative?: RegExp,
): Parser<string, TOptions, string> {
  if (!positive && !negative) {
    throw new Error('charTest: both positive and negative expressions are undefined');
  }
  return satisfy((c) => {
    if (positive && !positive.test(c)) { return false; }
    if (negative && negative.test(c)) { return false; }
    return true;
  });
}
