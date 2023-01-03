import { Matcher, Parser } from './types.ts';

/**
 * A wrapper that helps to create recursive parsers -
 * allows to refer to a parser defined later in the code.
 *
 * Alternatively, parsers defined/wrapped as functions
 * (rather than constants obtained by composition)
 * don't need this.
 *
 * This overload is for {@link Matcher}s.
 *
 * @param f - A function that returns a matcher.
 * @returns A parser wrapped into a function.
 */
export function recursive<TToken,TOptions,TValue> (
  f: () => Matcher<TToken,TOptions,TValue>
): Matcher<TToken,TOptions,TValue>;
/**
 * A wrapper that helps to create recursive parsers -
 * allows to refer to a parser defined later in the code.
 *
 * Alternatively, parsers defined/wrapped as functions
 * (rather than constants obtained by composition)
 * don't need this.
 *
 * @param f - A function that returns a parser.
 * @returns A parser wrapped into a function.
 */
export function recursive<TToken,TOptions,TValue> (
  f: () => Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue>;
export function recursive<TToken,TOptions,TValue> (
  f: () => Parser<TToken,TOptions,TValue>
): Parser<TToken,TOptions,TValue> {
  return function (data, i) {
    return f()(data, i);
  };
}
