import {
  Data, Matcher, Parser,
  match as matchCore,
  tryParse as tryParseCore,
  parserPosition as parserPositionCore
} from '../core';
import { clamp, escapeWhitespace } from '../util';

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
  data: Data<string,unknown>,
  i: number,
  contextTokens = 11
): string {
  const len = data.tokens.length;
  const lowIndex = clamp(0, i - contextTokens, len - contextTokens);
  const highIndex = clamp(contextTokens, i + 1 + contextTokens, len);
  const tokensSlice = data.tokens.slice(lowIndex, highIndex);
  if (tokensSlice.some((t) => t.length !== 1)) {
    return parserPositionCore(data, i, (t) => t);
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

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 *
 * This one throws an error in case parser didn't match
 * OR the match is incomplete (some part of input string left unparsed).
 *
 * Input string is broken down to characters as `[...str]`
 * unless you provide a pre-split array.
 *
 * @param parser - A parser to run.
 * @param str - Input string or an array of graphemes.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function parse<TOptions,TValue> (
  parser: Parser<string,TOptions,TValue>,
  str: string | string[],
  options: TOptions
): TValue {
  const data: Data<string,TOptions> = { tokens: [...str], options: options };
  const result = parser(data, 0);
  if (!result.matched) {
    throw new Error('No match');
  }
  if (result.position < data.tokens.length) {
    throw new Error(
      `Partial match. Parsing stopped at:\n${parserPosition(data, result.position)}`
    );
  }
  return result.value;
}

/**
 * Utility function that provides a bit cleaner interface
 * for running a parser over a string.
 * Returns `undefined` in case parser did not match.
 *
 * Input string is broken down to characters as `[...str]`
 * unless you provide a pre-split array.
 *
 * Note: this doesn't capture errors thrown during parsing.
 * Nonmatch is considered a part or normal flow.
 * Errors mean unrecoverable state and it's up to client code to decide
 * where to throw errors and how to get back to safe state.
 *
 * @param parser - A parser to run.
 * @param str - Input string or an array of graphemes.
 * @param options - Parser options.
 * @returns A matched value or `undefined` in case of nonmatch.
 *
 * @category Utility functions
 */
export function tryParse<TOptions,TValue> (
  parser: Parser<string,TOptions,TValue>,
  str: string | string[],
  options: TOptions
): TValue | undefined {
  return tryParseCore(parser, [...str], options);
}

/**
 * Utility function that provides a bit cleaner interface
 * for running a {@link Matcher} over a string.
 *
 * Input string is broken down to characters as `[...str]`
 * unless you provide a pre-split array.
 *
 * @param matcher - A matcher to run.
 * @param str - Input string or an array of graphemes.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function match<TOptions,TValue> (
  matcher: Matcher<string,TOptions,TValue>,
  str: string | string[],
  options: TOptions
): TValue {
  return matchCore(matcher, [...str], options);
}
