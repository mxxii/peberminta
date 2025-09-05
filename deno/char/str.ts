import type { Parser } from '../core.ts';

import { remainingTokensNumber } from '../core.ts';

/**
 * Make a parser that looks for the exact match for a given string,
 * returns a match with that string and consumes an according number of tokens.
 *
 * Empty string matches without consuming input.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param str - A string to look for.
 */
export function str<TOptions, const TString extends string> (
  str: TString,
): Parser<string, TOptions, TString> {
  const len = str.length;
  return (data, i) => {
    // Keep working even if tokens are
    // not single chars but multi-char graphemes etc.
    // Can't just take a slice of len from tokens.
    const tokensNumber = remainingTokensNumber(data, i);
    let substr = '';
    let j = 0;
    while (j < tokensNumber && substr.length < len) {
      substr += data.tokens[i + j];
      j++;
    }
    return (substr === str)
      ? {
          matched: true,
          position: i + j,
          value: str,
        }
      : { matched: false };
  };
}
