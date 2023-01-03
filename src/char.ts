/**
 * This is an additional module specifically for string parsers.
 *
 * It contains parsers with token type bound to be `string`
 * and expected to work with individual characters.
 *
 * It should work even if you have a custom way to split
 * a string into symbols such as graphemes.
 *
 * Node:
 * ```ts
 * import * as pc from 'peberminta/char';
 * ```
 *
 * Deno:
 * ```ts
 * import * as p from 'https://deno.land/x/peberminta@.../char.ts';
 * ```
 *
 * @packageDocumentation
 */

export { char } from './char/char';
export { charTest } from './char/charTest';
export { concat } from './char/concat';
export { oneOf, oneOf as anyOf } from './char/oneOf';
export { noneOf } from './char/noneOf';
export { str } from './char/str';

export { match, parse, parserPosition, tryParse } from './char/charUtils';
