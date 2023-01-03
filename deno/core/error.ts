import { Data, Matcher } from './types.ts';

/**
 * Make a {@link Matcher} that throws an error if reached.
 *
 * Use with caution!
 *
 * Use {@link fail} if parser can step back and try a different path.
 *
 * For error recovery you can try to encode erroneous state in an output value instead.
 *
 * @param message - The message or a function to construct it from the current parser state.
 */
export function error<TToken, TOptions>(
  message: string | ((data: Data<TToken, TOptions>, i: number) => string)
): Matcher<TToken, TOptions, never> {
  return (data, i) => {
    throw new Error((message instanceof Function) ? message(data, i) : message);
  };
}
