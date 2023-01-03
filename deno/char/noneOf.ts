import { Parser, token } from '../core.ts';

/**
 * Make a parser that matches and returns a character
 * if it is absent in a given character samples string/array.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param chars - An array (or a string) of all characters that are not acceptable.
 */
export function noneOf<TOptions>(
  chars: string | string[]
): Parser<string, TOptions, string> {
  return token((c) => (chars.includes(c)) ? undefined : c);
}
