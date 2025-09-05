import type { Match } from '../coreTypes/Match.ts';
import type { Result } from '../coreTypes/Result.ts';

export function mapOuter<TValue1, TValue2> (
  r: Result<TValue1>,
  f: (m: Match<TValue1>) => Result<TValue2>,
): Result<TValue2> {
  return (r.matched) ? f(r) : r;
}
