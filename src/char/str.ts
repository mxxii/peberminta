import { Parser, remainingTokensNumber } from '../core';

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
export function str<TOptions>(
  str: string
): Parser<string, TOptions, string> {
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
        value: str
      }
      : { matched: false };
  };
}
