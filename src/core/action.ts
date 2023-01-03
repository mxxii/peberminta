import { Data, Matcher } from './types';

/**
 * Make a {@link Matcher} that always succeeds with `null` value,
 * and performs an action / side effect without consuming input.
 *
 * Use {@link emit} or {@link make} if you want to produce a result.
 *
 * Use {@link peek} if you want to wrap another parser.
 *
 * @param f - A function to produce a side effect (logging, etc).
 */
export function action<TToken, TOptions>(
  /**
   * @param data - Data object (tokens and options).
   * @param i - Parser position in the tokens array.
   */
  f: (data: Data<TToken, TOptions>, i: number) => void
): Matcher<TToken, TOptions, null> {
  return (data, i) => {
    f(data, i);
    return {
      matched: true,
      position: i,
      value: null
    };
  };
}
