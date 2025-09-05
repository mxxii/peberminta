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


// #region Char types

import type { CharUnion } from './charTypes/CharUnion.ts';
import type { GraphemeUnion } from './charTypes/GraphemeUnion.ts';

export {
  type CharUnion,
  type GraphemeUnion,
};

// #endregion


// #region Parsers

import { char } from './char/char.ts';
import { oneOf } from './char/oneOf.ts';
import { noneOf } from './char/noneOf.ts';
import { charTest } from './char/charTest.ts';
import { str } from './char/str.ts';
import { concat } from './char/concat.ts';

export {
  char,
  oneOf,
  oneOf as anyOf,
  noneOf,
  charTest,
  str,
  concat,
};

// #endregion


// #region Utility functions

import { parserPosition } from './charUtil/parserPosition.ts';
import { parse } from './charUtil/parse.ts';
import { tryParse } from './charUtil/tryParse.ts';
import { match } from './charUtil/match.ts';

export {
  parserPosition,
  parse,
  tryParse,
  match,
};

// #endregion
