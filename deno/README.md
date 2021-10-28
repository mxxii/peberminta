# peberminta

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/mxxii/peberminta/blob/main/LICENSE)

Simple, transparent parser combinators toolkit that supports tokens of any type.

For when you wanna do weird things with parsers.


## Features

- **Well typed** - written in TypeScript and with a lot of attention to keep types well defined.

- **Highly generic** - no constraints on tokens, options (additional state data) and output types. Core module has not a single mention of strings as a part of normal flow. Some string-specific building blocks can be loaded from a separate module in case you need them.

- **Transparent**. Built on a very simple base idea - just a few type aliases. Whole parser state is accessible at any time.

- **Lightweight**. Zero dependencies. Just type aliases and functions.

- **Batteries included** - comes with a pretty big set of building blocks.

- **Easy to extend** - just follow the convention defined by type aliases when making your own building blocks. *(And maybe let me know what you think can be universally useful to be included in the package itself.)*

- **Easy to make configurable parsers**. Rather than dynamically composing parsers based on options or manually weaving options into a dynamic parser state, this package offers a standard way to treat options as a part of static data and access them at any moment for course correction.

- **Well tested** - comes will tests for everything including examples.

- **Practicality over "purity"**. To be understandable and self-consistent is more important than to follow an established encoding of abstract ideas. More on this below.

- **No streaming** - accepts a fixed array of tokens. It is simple, whole input can be accessed at any time if needed. More on this below.

- **Bring your own lexer/tokenizer** - if you need it. It doesn't matter how tokens are made - this package can consume anything you can type. I have a lexer as well, called [leac](https://github.com/mxxii/leac), and it is used in some examples, but there is nothing special about it to make it the best match (well, maybe the fact it is written in TypeScript, has equal level of maintenance and is made with arrays instead of iterators in mind as well).


## Install

```shell
> npm i peberminta
```


## Examples

- [JSON](https://github.com/mxxii/peberminta/blob/main/examples/json.ts);
- [CSV](https://github.com/mxxii/peberminta/blob/main/examples/csv.ts);
- [Hex Color](https://github.com/mxxii/peberminta/blob/main/examples/hexColor.ts);
- [Calc](https://github.com/mxxii/peberminta/blob/main/examples/calc.ts);
- [Brainfuck](https://github.com/mxxii/peberminta/blob/main/examples/bf1.ts) (and [another implementation](https://github.com/mxxii/peberminta/blob/main/examples/bf2.ts));
- [Non-decreasing sequences](https://github.com/mxxii/peberminta/blob/main/examples/nonDec.ts);
- *feel free to PR or request interesting compact grammar examples.*


## API

Detailed API documentation with navigation and search:

- [core module](core.html); <!-- TODO: links -->
- [char module](char.html).

### Convention

Whole package is built around these type aliases:

```typescript
export type Data<TToken,TOptions> = {
  tokens: TToken[],
  options: TOptions
};

export type Parser<TToken,TOptions,TValue> =
  (data: Data<TToken,TOptions>, i: number) => Result<TValue>;

export type Matcher<TToken,TOptions,TValue> =
  (data: Data<TToken,TOptions>, i: number) => Match<TValue>;

export type Result<TValue> = Match<TValue> | NonMatch;

export type Match<TValue> = {
  matched: true,
  position: number,
  value: TValue
};

export type NonMatch = {
  matched: false
};
```

- **Data** object holds tokens array and possibly an options object - it's just a container for all static data used by a parser. Parser position, on the other hand, has it's own life cycle and passed around separately.

- A **Parser** is a function that accepts Data object and a parser position, looks into the tokens array at the given position and returns either a Match with a parsed value (use `null` if there is no value) and a new position or a NonMatch.

- A **Matcher** is a special case of Parser that never fails and always returns a Match.

- **Result** object from a Parser can be either a Match or a NonMatch.

- **Match** is a result of successful parsing - it contains a parsed value and a new parser position.

- **NonMatch** is a result of unsuccessful parsing. It doesn't have any data attached to it.

- **TToken** can be any type.

- **TOptions** can be any type. Use it to make your parser customizable. Or set it as `undefined` and type as `unknown` if not needed.

### Building blocks

#### Core blocks

<div class="headlessTable">

| <!-- --> | <!-- --> | <!-- --> | <!-- -->
| -------- | -------- | -------- | --------
| [ab](core.html#ab) | [abc](core.html#abc) | [action](core.html#action) | [ahead](core.html#ahead)
| [all](core.html#all) | _[and](core.html#and)_ | [any](core.html#any) | [chain](core.html#chain)
| [chainReduce](core.html#chainReduce) | [choice](core.html#choice) | [condition](core.html#condition) | [decide](core.html#decide)
| _[discard](core.html#discard)_ | [emit](core.html#emit) | [end](core.html#end) | _[eof](core.html#eof)_
| [error](core.html#error) | [fail](core.html#fail) | [flatten](core.html#flatten) | [flatten1](core.html#flatten1)
| [left](core.html#left) | [leftAssoc1](core.html#leftAssoc1) | [leftAssoc2](core.html#leftAssoc2) | [longest](core.html#longest)
| _[lookAhead](core.html#lookAhead)_ | [make](core.html#make) | [many](core.html#many) | [many1](core.html#many1)
| [map](core.html#map) | [map1](core.html#map1) | [middle](core.html#middle) | [not](core.html#not)
| _[of](core.html#of)_ | [option](core.html#option) | _[or](core.html#or)_ | [otherwise](core.html#otherwise)
| [peek](core.html#peek) | [recursive](core.html#recursive) | [reduceLeft](core.html#reduceLeft) | [reduceRight](core.html#reduceRight)
| [right](core.html#right) | [rightAssoc1](core.html#rightAssoc1) | [rightAssoc2](core.html#rightAssoc2) | [satisfy](core.html#satisfy)
| [sepBy](core.html#sepBy) | [sepBy1](core.html#sepBy1) | [skip](core.html#skip) | _[some](core.html#some)_
| [start](core.html#start) | [takeUntil](core.html#takeUntil) | [takeUntilP](core.html#takeUntilP) | [takeWhile](core.html#takeWhile)
| [takeWhileP](core.html#takeWhileP) | [token](core.html#token)

</div>

#### Core utilities

<div class="headlessTable">

| <!-- --> | <!-- --> | <!-- --> | <!-- -->
| -------- | -------- | -------- | --------
| [match](core.html#match) | [parse](core.html#parse) | [parserPosition](core.html#parserPosition) | [remainingTokensNumber](core.html#remainingTokensNumber)
| [tryParse](char.html#tryParse)

</div>

#### Char blocks

<div class="headlessTable">

| <!-- --> | <!-- --> | <!-- --> | <!-- -->
| -------- | -------- | -------- | --------
| _[anyOf](char.html#anyOf)_ | [char](char.html#char) | [charTest](char.html#charTest) | [concat](char.html#concat)
| [noneOf](char.html#noneOf) | [oneOf](char.html#oneOf) | [str](char.html#str)

</div>

#### Char utilities

<div class="headlessTable">

| <!-- --> | <!-- --> | <!-- --> | <!-- -->
| -------- | -------- | -------- | --------
| [match](char.html#match) | [parse](char.html#parse) | [parserPosition](char.html#parserPosition) | [tryParse](char.html#tryParse)

</div>


## What about ...?

- performance - The code is very simple but I won't put any unverified assumptions here. I'd be grateful to anyone who can set up a good benchmark project to compare different parser combinators.

- stable release - Current release is well thought out and tested. I leave a chance that some supplied functions may need an incompatible change. Before version 1.0.0 this will be done without a deprecation cycle.

- streams/iterators - Maybe some day, if the need to parse a stream of non-string data arise. For now I don't have a task that would force me to think well on how to design it. It would require a significant trade off and may end up being a separate module (like `char`) at best or even a separate package.

- Fantasy Land - You can find some familiar ideas here, especially when compared to Static Land. But I'm not concerned about compatibility with that spec - see "Practicality over "purity"" entry above. What I think might make sense is to add separate tests for laws applicable in context of this package. Low priority though.


## Some other parser combinator packages

- [arcsecond](https://github.com/francisrstokes/arcsecond);
- [parsimmon](https://github.com/jneen/parsimmon);
- [chevrotain](https://github.com/Chevrotain/chevrotain);
- [prsc.js](https://github.com/bwrrp/prsc.js);
- [lop](https://github.com/mwilliamson/lop);
- [parser-lang](https://www.npmjs.com/package/parser-lang);
- *and more, with varied level of maintenance.*
