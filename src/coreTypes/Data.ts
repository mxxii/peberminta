
/**
 * Data that is passed around between composed {@link Parser}s.
 *
 * Intended to be static, although nothing prevents you from
 * accumulating data inside options object - if it makes sense for a particular use case.
 *
 * Keep in mind that it is the same object that is passed around.
 * Anything that requires rollbacks - have to be handled in the parser result value instead.
 *
 * @category Core types
 */
export type Data<TToken, TOptions> = {
  /** Tokens array - the subject of parsing. */
  tokens: TToken[];
  /** Parser options object. */
  options: TOptions;
};
