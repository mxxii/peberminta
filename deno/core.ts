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

export type { Data, Match, NonMatch, Result, Parser, Matcher } from './core/types.ts';

export { ab, left, right } from './core/ab.ts';
export { abc, middle } from './core/abc.ts';
export { action } from './core/action.ts';
export { ahead, ahead as lookAhead } from './core/ahead.ts';
export { all, all as and } from './core/all.ts';
export { any } from './core/any.ts';
export { chain } from './core/chain.ts';
export { choice, choice as or } from './core/choice.ts';
export { condition } from './core/condition.ts';
export { decide } from './core/decide.ts';
export { emit, emit as of } from './core/emit.ts';
export { end, end as eof } from './core/end.ts';
export { error } from './core/error.ts';
export { fail } from './core/fail.ts';
export { flatten, flatten1 } from './core/flatten.ts';
export { longest } from './core/longest.ts';
export { make } from './core/make.ts';
export { many, many1, many1 as some } from './core/many.ts';
export { map, map1 } from './core/map.ts';
export { not } from './core/not.ts';
export { option } from './core/option.ts';
export { otherwise, otherwise as eitherOr } from './core/otherwise.ts';
export { peek } from './core/peek.ts';
export { recursive } from './core/recursive.ts';
export { chainReduce, reduceLeft, reduceRight, leftAssoc1, leftAssoc2, rightAssoc1, rightAssoc2 } from './core/reduce.ts';
export { satisfy } from './core/satisfy.ts';
export { sepBy, sepBy1 } from './core/sep.ts';
export { skip, skip as discard } from './core/skip.ts';
export { start } from './core/start.ts';
export { takeWhile, takeWhileP, takeUntil, takeUntilP } from './core/take.ts';
export { token } from './core/token.ts';

export { match, parse, parserPosition, remainingTokensNumber, tryParse } from './core/coreUtils.ts';
