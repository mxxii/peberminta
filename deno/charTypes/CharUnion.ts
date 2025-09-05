
/**
 * Constructs a tuple type from the characters of a given string.
 *
 * @category Utility types
 */
export type CharUnion<TChars extends string>
  = string extends TChars ? string
  : TChars extends `${infer First}${infer Rest}` ? First | CharUnion<Rest>
  : never;
