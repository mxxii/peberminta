
/**
 * Data that is passed around between composed {@link Parser}s.
 *
 * Intended to be static, although nothing prevents you from
 * accumulating data inside options object if parsed grammar allows to do so.
 *
 * @category Type aliases
 */
export type Data<TToken,TOptions> = {
  /** Tokens array - the subject of parsing. */
  tokens: TToken[],
  /** Parser options object. */
  options: TOptions
};

/**
 * Matched (successful) result from a {@link Parser}/{@link Matcher}.
 *
 * @category Type aliases
 */
export type Match<TValue> = {
  matched: true,
  /** Parser position after this match. */
  position: number,
  /** Matched value. */
  value: TValue
};

/**
 * Unsuccessful result from a {@link Parser}.
 *
 * @category Type aliases
 */
export type NonMatch = {
  matched: false
};

/**
 * Result from a {@link Parser}.
 *
 * @category Type aliases
 */
export type Result<TValue> = Match<TValue> | NonMatch;

/**
 * Parser function.
 * Accepts {@link Data} and token position, returns a {@link Result}.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 *
 * @category Type aliases
 */
export type Parser<TToken,TOptions,TValue> = (data: Data<TToken,TOptions>, i: number) => Result<TValue>;

/**
 * Special case of {@link Parser} function.
 * Accepts {@link Data} and token position, always returns a {@link Match}.
 *
 * @param data - Data object (tokens and options).
 * @param i - Parser position in the tokens array.
 *
 * @category Type aliases
 */
export type Matcher<TToken,TOptions,TValue> = (data: Data<TToken,TOptions>, i: number) => Match<TValue>;
