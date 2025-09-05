/**
 * This is the base module of the package.
 *
 * It contains type aliases and generic parsers
 * (not bound to a particular token type).
 *
 * Node:
 * ```ts
 * import * as p from 'peberminta';
 * ```
 *
 * Deno:
 * ```ts
 * import * as p from 'https://deno.land/x/peberminta@.../core.ts';
 * ```
 *
 * @packageDocumentation
 */


// #region Core types

import { type Data } from './coreTypes/Data.ts';
import { type Match } from './coreTypes/Match.ts';
import { type NonMatch } from './coreTypes/NonMatch.ts';
import { type Result } from './coreTypes/Result.ts';
import { type Parser } from './coreTypes/Parser.ts';
import { type Matcher } from './coreTypes/Matcher.ts';
import { type TupleOf } from './coreTypes/TupleOf.ts';

export {
  type Data,
  type Match,
  type NonMatch,
  type Result,
  type Parser,
  type Matcher,
  type TupleOf,
};

// #endregion


// #region Parsers

import { ab } from './core/ab.ts';
import { abc } from './core/abc.ts';
import { action } from './core/action.ts';
import { ahead } from './core/ahead.ts';
import { all } from './core/all.ts';
import { any } from './core/any.ts';
import { chain } from './core/chain.ts';
import { chainReduce } from './core/chainReduce.ts';
import { condition } from './core/condition.ts';
import { decide } from './core/decide.ts';
import { eitherOr } from './core/eitherOr.ts';
import { emit } from './core/emit.ts';
import { end } from './core/end.ts';
import { error } from './core/error.ts';
import { fail } from './core/fail.ts';
import { first } from './core/first.ts';
import { flatten } from './core/flatten.ts';
import { flatten1 } from './core/flatten1.ts';
import { last } from './core/last.ts';
import { left } from './core/left.ts';
import { leftAssoc1 } from './core/leftAssoc1.ts';
import { leftAssoc2 } from './core/leftAssoc2.ts';
import { longest } from './core/longest.ts';
import { make } from './core/make.ts';
import { many } from './core/many.ts';
import { many1 } from './core/many1.ts';
import { map } from './core/map.ts';
import { mapR } from './core/mapR.ts';
import { middle } from './core/middle.ts';
import { not } from './core/not.ts';
import { option } from './core/option.ts';
import { peek } from './core/peek.ts';
import { recursive } from './core/recursive.ts';
import { reduceLeft } from './core/reduceLeft.ts';
import { reduceRight } from './core/reduceRight.ts';
import { right } from './core/right.ts';
import { rightAssoc1 } from './core/rightAssoc1.ts';
import { rightAssoc2 } from './core/rightAssoc2.ts';
import { satisfy } from './core/satisfy.ts';
import { sepBy } from './core/sepBy.ts';
import { sepBy1 } from './core/sepBy1.ts';
import { skip } from './core/skip.ts';
import { start } from './core/start.ts';
import { takeMinMax } from './core/takeMinMax.ts';
import { takeN } from './core/takeN.ts';
import { takeUntil } from './core/takeUntil.ts';
import { takeUntilP } from './core/takeUntilP.ts';
import { takeWhile } from './core/takeWhile.ts';
import { takeWhileP } from './core/takeWhileP.ts';
import { token } from './core/token.ts';
import { filter } from './core/filter.ts';

export {
  ab,
  abc,
  action,
  ahead,
  ahead as lookAhead,
  all,
  all as and,
  any,
  chain,
  chainReduce,
  condition,
  decide,
  eitherOr,
  eitherOr as otherwise,
  emit,
  emit as of,
  end,
  end as eof,
  error,
  fail,
  filter,
  filter as guard,
  filter as refine,
  first,
  first as choice,
  first as or,
  flatten,
  flatten1,
  last,
  left,
  leftAssoc1,
  leftAssoc2,
  longest,
  make,
  many,
  many1,
  many1 as some,
  map,
  mapR,
  /** @deprecated Renamed to {@link mapR}! */
  mapR as map1,
  middle,
  middle as between,
  not,
  option,
  peek,
  recursive,
  reduceLeft,
  reduceRight,
  right,
  rightAssoc1,
  rightAssoc2,
  satisfy,
  sepBy,
  sepBy1,
  skip,
  skip as discard,
  start,
  takeMinMax,
  takeN,
  takeUntil,
  takeUntilP,
  takeWhile,
  takeWhileP,
  token,
};

// #endregion


// #region Utility functions

import { remainingTokensNumber } from './coreUtil/remainingTokensNumber.ts';
import { parserPosition } from './coreUtil/parserPosition.ts';
import { parse } from './coreUtil/parse.ts';
import { tryParse } from './coreUtil/tryParse.ts';
import { match } from './coreUtil/match.ts';

export {
  remainingTokensNumber,
  parserPosition,
  parse,
  tryParse,
  match,
};

// #endregion
