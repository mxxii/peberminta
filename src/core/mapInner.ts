import type { Result } from '../coreTypes/Result.ts';

export function mapInner<TValue1, TValue2> (
  r: Result<TValue1>,
  f: (v: TValue1, j: number) => TValue2,
): Result<TValue2> {
  return (r.matched)
    ? ({
        matched: true,
        position: r.position,
        value: f(r.value, r.position),
      })
    : r;
}
