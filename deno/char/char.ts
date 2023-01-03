import { Parser, token } from '../core.ts';

/**
 * Make a parser that looks for the exact match for a given character
 * and returns a match with that character.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param char - A character to look for.
 */
export function char<TOptions>(
  char: string
): Parser<string, TOptions, string> {
  return token((c) => (c === char) ? c : undefined);
}
