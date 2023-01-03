import { Data, Matcher } from './types.ts';

/**
 * Make a {@link Matcher} that always succeeds
 * and makes a value with provided function without consuming input.
 *
 * Use {@link emit} if you want to emit the same value every time.
 *
 * Use {@link action} if you only need a side effect.
 *
 * Use {@link token} if you want to make a value based on an input token.
 *
 * @param f - A function to get the value.
 */
export function make<TToken, TOptions, TValue>(
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array.
   */
  f: (data: Data<TToken, TOptions>, i: number) => TValue
): Matcher<TToken, TOptions, TValue> {
  return (data, i) => ({
    matched: true,
    position: i,
    value: f(data, i)
  });
}
