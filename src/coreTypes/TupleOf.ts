
/**
 * Construct a tuple type of a given length.
 *
 * @category Utility types
 */
export type TupleOf<TValue, N extends number, R extends unknown[] = []>
  = number extends N ? TValue[]
  : R['length'] extends N ? R
  : TupleOf<TValue, N, [TValue, ...R]>;
