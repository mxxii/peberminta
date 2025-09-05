import type { Data } from '../coreTypes/Data.ts';

import { clamp, escapeWhitespace } from '../util/util.ts';

/**
 * Utility function to render a given parser position
 * for error reporting and debug purposes.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 * @param formatToken - A function to stringify a token.
 * @param contextTokens - How many tokens around the current one to render.
 * @returns A multiline string.
 *
 * @category Utility functions
 */
export function parserPosition<TToken> (
  data: Data<TToken, unknown>,
  i: number,
  formatToken: (t: TToken) => string,
  contextTokens = 3,
): string {
  const len = data.tokens.length;
  const lowIndex = clamp(0, i - contextTokens, len - contextTokens);
  const highIndex = clamp(contextTokens, i + 1 + contextTokens, len);
  const tokensSlice = data.tokens.slice(lowIndex, highIndex);
  const lines: string[] = [];
  const indexWidth = String(highIndex - 1).length + 1;
  if (i < 0) {
    lines.push(`${String(i).padStart(indexWidth)} >>`);
  }
  if (0 < lowIndex) {
    lines.push('...'.padStart(indexWidth + 6));
  }
  for (let j = 0; j < tokensSlice.length; j++) {
    const index = lowIndex + j;
    lines.push(`${
      String(index).padStart(indexWidth)
    } ${
      (index === i ? '>' : ' ')
    } ${
      escapeWhitespace(formatToken(tokensSlice[j]))
    }`);
  }
  if (highIndex < len) {
    lines.push('...'.padStart(indexWidth + 6));
  }
  if (len <= i) {
    lines.push(`${String(i).padStart(indexWidth)} >>`);
  }
  return lines.join('\n');
}
