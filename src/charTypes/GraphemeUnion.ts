import type { CharUnion } from './CharUnion.ts';

/**
 * Constructs a tuple type from the elements of a given string or array of strings.
 *
 * @category Utility types
 */
export type GraphemeUnion<TGraphemes extends string | string[]>
  = TGraphemes extends string ? CharUnion<TGraphemes>
  : TGraphemes extends string[] ? TGraphemes[number]
  : never;
