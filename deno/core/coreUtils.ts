import { Data, Match, Matcher, Parser, Result } from './types.ts';
import { clamp, escapeWhitespace } from '../util.ts';

/**
 * Utility function returning the number of tokens
 * that are not yet parsed (current token included).
 *
 * Useful when creating custom base parsers.
 *
 * Note: Can return a negative value if the supplied position
 * goes beyond the tokens array length for whatever reason.
 *
 * @param data - Data.
 * @param i - Current position.
 *
 * @category Utility functions
 */
export function remainingTokensNumber<TToken>(
  data: Data<TToken, unknown>, i: number
): number {
  return data.tokens.length - i;
}

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
  data: Data<TToken,unknown>,
  i: number,
  formatToken: (t: TToken) => string,
  contextTokens = 3
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

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 *
 * This one throws an error in case parser didn't match
 * OR the match is incomplete (some part of tokens array left unparsed).
 *
 * @param parser - A parser to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @param formatToken - A function to stringify a token
 * (Defaults to `JSON.stringify`. For incomplete match error message).
 *
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function parse<TToken,TOptions,TValue> (
  parser: Parser<TToken,TOptions,TValue>,
  tokens: TToken[],
  options: TOptions,
  formatToken: (t: TToken) => string = JSON.stringify
): TValue {
  const data: Data<TToken,TOptions> = { tokens: tokens, options: options };
  const result = parser(data, 0);
  if (!result.matched) {
    throw new Error('No match');
  }
  if (result.position < data.tokens.length) {
    throw new Error(
      `Partial match. Parsing stopped at:\n${parserPosition(data, result.position, formatToken)}`
    );
  }
  return result.value;
}

/**
 * Utility function that provides a bit cleaner interface for running a parser.
 * Returns `undefined` in case parser did not match.
 *
 * Note: this doesn't capture errors thrown during parsing.
 * Nonmatch is considered a part or normal flow.
 * Errors mean unrecoverable state and it's up to client code to decide
 * where to throw errors and how to get back to safe state.
 *
 * @param parser - A parser to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @returns A matched value or `undefined` in case of nonmatch.
 *
 * @category Utility functions
 */
export function tryParse<TToken,TOptions,TValue> (
  parser: Parser<TToken,TOptions,TValue>,
  tokens: TToken[],
  options: TOptions
): TValue | undefined {
  const result = parser({ tokens: tokens, options: options }, 0);
  return (result.matched)
    ? result.value
    : undefined;
}

/**
 * Utility function that provides a bit cleaner interface for running a {@link Matcher}.
 *
 * @param matcher - A matcher to run.
 * @param tokens - Input tokens.
 * @param options - Parser options.
 * @returns A matched value.
 *
 * @category Utility functions
 */
export function match<TToken,TOptions,TValue> (
  matcher: Matcher<TToken,TOptions,TValue>,
  tokens: TToken[],
  options: TOptions
): TValue {
  const result = matcher({ tokens: tokens, options: options }, 0);
  return result.value;
}

// -----------------------------------------------------------

export function _mapInner<TValue1,TValue2> (
  r: Result<TValue1>,
  f: (v: TValue1, j: number) => TValue2
): Result<TValue2> {
  return (r.matched) ? ({
    matched: true,
    position: r.position,
    value: f(r.value, r.position)
  }) : r;
}

export function _mapOuter<TValue1,TValue2> (
  r: Result<TValue1>,
  f: (m: Match<TValue1>) => Result<TValue2>
): Result<TValue2> {
  return (r.matched) ? f(r) : r;
}
