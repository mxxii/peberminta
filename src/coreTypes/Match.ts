
/**
 * Matched (successful) result from a {@link Parser}/{@link Matcher}.
 *
 * @category Core types
 */
export type Match<TValue> = {
  matched: true;
  /** Parser position after this match. */
  position: number;
  /** Matched value. */
  value: TValue;
};
