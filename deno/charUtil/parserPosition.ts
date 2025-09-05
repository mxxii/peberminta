import type { Data } from '../core.ts';

import { parserPosition as parserPositionCore } from '../core.ts';
import { clamp, escapeWhitespace } from '../util/util.ts';

/**
 * Utility function to render a given parser position
 * for error reporting and debug purposes.
 *
 * This is a version specific for char parsers.
 *
 * Note: it will fall back to core version (one token per line)
 * in case any multicharacter tokens are present.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 * @param contextTokens - How many tokens (characters) around the current one to render.
 * @returns A multiline string.
 *
 * @category Utility functions
 */
export function parserPosition (
  data: Data<string, unknown>,
  i: number,
  contextTokens = 11,
): string {
  const len = data.tokens.length;
  const lowIndex = clamp(0, i - contextTokens, len - contextTokens);
  const highIndex = clamp(contextTokens, i + 1 + contextTokens, len);
  const tokensSlice = data.tokens.slice(lowIndex, highIndex);
  if (tokensSlice.some(t => t.length !== 1)) {
    return parserPositionCore(data, i, t => t);
  }
  let line = '';
  let offset = 0;
  let markerLen = 1;
  if (i < 0) { line += ' '; }
  if (0 < lowIndex) { line += '...'; }
  for (let j = 0; j < tokensSlice.length; j++) {
    const token = escapeWhitespace(tokensSlice[j]);
    if (lowIndex + j === i) {
      offset = line.length;
      markerLen = token.length;
    }
    line += token;
  }
  if (highIndex < len) { line += '...'; }
  if (len <= i) { offset = line.length; }
  return `${''.padEnd(offset)}${i}\n${line}\n${''.padEnd(offset)}${'^'.repeat(markerLen)}`;
}
