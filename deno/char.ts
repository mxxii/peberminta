/**
 * This is an additional module specifically for string parsers.
 *
 * It contains parsers with token type bound to be `string`
 * and expected to work with individual characters.
 *
 * It should work even if you have a custom way to split
 * a string into symbols such as graphemes.
 *
 * Import as:
 * ```ts
 * import * as pc from 'peberminta/char';
 * ```
 *
 * @module
 */

import {
  Parser, Matcher, Data,
  token, map, flatten, remainingTokensNumber,
  tryParse as tryParseCore, match as matchCore,
  parserPosition as parserPositionCore
} from './core.ts';
import { clamp, escapeWhitespace } from './util.ts';

/**
 * Make a parser that looks for the exact match for a given character
 * and returns a match with that character.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param char - A character to look for.
 */
export function char<TOptions> (
  char: string
): Parser<string,TOptions,string> {
  return token((c) => (c === char) ? c : undefined);
}

/**
 * Make a parser that matches and returns a character
 * if it is present in a given character samples string.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param chars - An array (or a string) of all acceptable characters.
 */
export function oneOf<TOptions> (
  chars: string | string[]
): Parser<string,TOptions,string> {
  return token((c) => (chars.includes(c)) ? c : undefined);
}

export { oneOf as anyOf };

/**
 * Make a parser that matches and returns a character
 * if it is absent in a given character samples string.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param chars - An array (or a string) of all characters that are not acceptable.
 */
export function noneOf<TOptions> (
  chars: string | string[]
): Parser<string,TOptions,string> {
  return token((c) => (chars.includes(c)) ? undefined : c);
}

/**
 * Make a parser that matches input character against given regular expression.
 *
 * Use this to match characters belonging to a certain range
 * or having a certain [unicode property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes).
 *
 * Use `satisfy` from core module instead if you need a predicate.
 *
 * Tokens expected to be individual characters/graphemes.
 *
 * @param regex - Tester regular expression.
 */
export function charTest<TOptions> (
  regex: RegExp
): Parser<string,TOptions,string> {
  return token((c) => regex.test(c) ? c : undefined);
}

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
export function str<TOptions> (
  str: string
): Parser<string,TOptions,string> {
  const len = str.length;
  return (data, i) => {
    // Keep working even if tokens are
    // not single chars but multi-char graphemes etc.
    // Can't just take a slice of len from tokens.
    const tokensNumber = remainingTokensNumber(data, i);
    let substr = '';
    let j = 0;
    while (j < tokensNumber && substr.length < len) {
      substr += data.tokens[i+j];
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

/**
 * Make a parser that concatenates characters/strings
 * from all provided parsers into a single string.
 *
 * Nonmatch is returned if any of parsers didn't match.
 *
 * @param ps - Parsers sequence.
 * Each parser can return a string or an array of strings.
 */
export function concat<TOptions> (
  ...ps: Parser<string,TOptions,string|string[]>[]
): Parser<string,TOptions,string> {
  return map(
    flatten(...ps),
    (vs) => vs.join('')
  );
}


//------------------------------------------------------------


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
 * @param contextTokens - How many tokens around the current one to render.
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
 * @param expectMulticharGraphemes - Fallback to line-by-line tokens output
 * (For incomplete match error message.)
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
