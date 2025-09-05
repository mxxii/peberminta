import type { Data } from './Data.ts';
import type { Result } from './Result.ts';

/**
 * Parser function.
 * Accepts {@link Data} and token position, returns a {@link Result}.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 *
 * @category Core types
 */
export type Parser<TToken, TOptions, TValue>
  = (data: Data<TToken, TOptions>, i: number) => Result<TValue>;
