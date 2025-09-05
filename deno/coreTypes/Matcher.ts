import type { Data } from './Data.ts';
import type { Match } from './Match.ts';

/**
 * Special case of {@link Parser} function.
 * Accepts {@link Data} and token position, always returns a {@link Match}.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 *
 * @category Core types
 */
export type Matcher<TToken, TOptions, TValue>
  = (data: Data<TToken, TOptions>, i: number) => Match<TValue>;
