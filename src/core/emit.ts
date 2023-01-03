import { Matcher } from './types';

/**
 * Make a {@link Matcher} that always succeeds with provided value and doesn't consume input.
 *
 * Use {@link make} if you want to make a value dynamically.
 *
 * @param value - The value that is always returned.
 */
export function emit<TToken, TOptions, TValue>(
  value: TValue
): Matcher<TToken, TOptions, TValue> {
  return (data, i) => ({
    matched: true,
    position: i,
    value: value
  });
}
