import type { Match } from './Match.ts';
import type { NonMatch } from './NonMatch.ts';

/**
 * Result from a {@link Parser}.
 *
 * @category Core types
 */
export type Result<TValue> = Match<TValue> | NonMatch;
