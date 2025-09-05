import type { GraphemeUnion } from '../charTypes/GraphemeUnion.ts';
import type { Parser } from '../core.ts';

import { token } from '../core.ts';

/**
 * Make a parser that matches and returns a character
 * if it is present in a given character samples string/array.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param chars - An array (or a string) of all acceptable characters.
 */
export function oneOf<TOptions, const TChars extends string | string[]> (
  chars: TChars,
): Parser<string, TOptions, GraphemeUnion<TChars>> {
  return token(c => (chars.includes(c)) ? c as GraphemeUnion<TChars> : undefined);
}
