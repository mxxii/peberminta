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

export type { Data, Match, NonMatch, Result, Parser, Matcher } from './core/types';

export { ab, left, right } from './core/ab';
export { abc, middle } from './core/abc';
export { action } from './core/action';
export { ahead, ahead as lookAhead } from './core/ahead';
export { all, all as and } from './core/all';
export { any } from './core/any';
export { chain } from './core/chain';
export { choice, choice as or } from './core/choice';
export { condition } from './core/condition';
export { decide } from './core/decide';
export { emit, emit as of } from './core/emit';
export { end, end as eof } from './core/end';
export { error } from './core/error';
export { fail } from './core/fail';
export { flatten, flatten1 } from './core/flatten';
export { longest } from './core/longest';
export { make } from './core/make';
export { many, many1, many1 as some } from './core/many';
export { map, map1 } from './core/map';
export { not } from './core/not';
export { option } from './core/option';
export { otherwise, otherwise as eitherOr } from './core/otherwise';
export { peek } from './core/peek';
export { recursive } from './core/recursive';
export { chainReduce, reduceLeft, reduceRight, leftAssoc1, leftAssoc2, rightAssoc1, rightAssoc2 } from './core/reduce';
export { satisfy } from './core/satisfy';
export { sepBy, sepBy1 } from './core/sep';
export { skip, skip as discard } from './core/skip';
export { start } from './core/start';
export { takeWhile, takeWhileP, takeUntil, takeUntilP } from './core/take';
export { token } from './core/token';

export { match, parse, parserPosition, remainingTokensNumber, tryParse } from './core/coreUtils';
