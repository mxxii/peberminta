import { Parser, token } from '../core';

/**
 * Make a parser that matches and returns a character
 * if it is present in a given character samples string/array.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param chars - An array (or a string) of all acceptable characters.
 */

export function oneOf<TOptions>(
  chars: string | string[]
): Parser<string, TOptions, string> {
  return token((c) => (chars.includes(c)) ? c : undefined);
}
