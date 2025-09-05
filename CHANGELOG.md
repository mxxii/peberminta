# Changelog

## Version 0.10.0

### General

- Targeting Node 20 and ES2020;
- Adjustment of `package.json` exports;
- Reorganized tests for easier maintenance;
- Improved documentation.

### `core` module

- New functions `takeN` and `takeMinMax`;
- New function `filter` and aliases `guard` and `refine`
  - can reject matches and narrow types based on a predicate/type guard;
- `takeWhile` now can narrow the value type if provided a type guard;
- `satisfy` now can narrow the token type if provided a type guard;
- Renamed `choice` to `first` - to better reflect the order of evaluation
  - `choice` and `or` are still available as aliases for it;
- New function `last`
  - tries provided parsers in reverse order
  - for convenience when converting a grammar that puts more specific alternatives after general ones;
- Renamed `map1` to `mapR`
  - old name provided as a deprecated alias and will be removed in the next minor/major version;
- `eitherOr` is now a function and `otherwise` is an alias for it;
- New alias `between` added for function `middle`;
- New `core` types: `TupleOf` - for better type inference in `takeN`.

### `char` module

- Now `char.charTest` can have two arguments: `positive` and `negative` regular expressions
  - for convenience when defining character exclusions;
- Better type inference in `char.oneOf`;
- New `char` types: `CharUnion`, `GraphemeUnion` - for better type inference in `oneOf`.

----

## Version 0.9.0

- many functions got overloads for `Matcher` type propagation in less common scenarios;
- `condition` function now accepts Parsers/Matchers with different value types, result value type is the union of the two;
- added type tests for overloads using [expect-type](https://github.com/mmkal/expect-type).

----

## Version 0.8.0

- Targeting Node.js version 14 and ES2020;
- Now should be discoverable with [denoify](https://github.com/garronej/denoify).

----

## Version 0.7.0

- `otherwise` function now has two overloads - `Parser * Matcher -> Matcher` and `Parser * Parser -> Parser`;
- `otherwise` function now accepts Parsers/Matchers with different value types, result value type is the union of the two;
- `otherwise` function now has an alias called `eitherOr` which might be more natural for combining parsers.

----

## Version 0.6.0

- ensure local imports have file extensions - fix "./core module cannot be found" issue.

----

## Version 0.5.4

- remove terser, source-map files;
- use only `rollup-plugin-cleanup` to condition published files.

## Version 0.5.3

- source-map files;
- minor documentation update.

## Version 0.5.2

- `peek` function keeps Parser/Matcher distinction;

## Version 0.5.1

- documentation updates;
- package marked as free of side effects for tree shaking.

## Version 0.5.0

- Initial release;
- Aiming at Node.js version 12 and up.
