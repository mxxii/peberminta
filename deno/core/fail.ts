import { Data, NonMatch } from './types.ts';

/**
 * Parser that never matches.
 *
 * Use this as a part of normal flow, when alternative match might still exist.
 *
 * Use {@link error} to interrupt the parsing from unrecoverable situation.
 */
export function fail<TToken, TOptions>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: Data<TToken, TOptions>, i: number
): NonMatch {
  return { matched: false };
}
