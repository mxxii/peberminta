
// https://www.crockford.com/mckeeman.html
// This implementation closely follows the McKeeman Form grammar as described on the website.


import { inspect } from 'util';
import * as p from '../src/core.ts';
import * as pc from '../src/char.ts';


// Types

type NameItem = { type: 'name'; name: string };
type StringItem = { type: 'string'; value: string };
type CharItem = { type: 'char'; value: string };
type RangeItem = { type: 'range'; from: string; to: string };
type RangeWithExcludesItem = RangeItem & { excludes: ExcludeItem[] };

type ExcludeItem = CharItem | RangeItem;
type Item = NameItem | StringItem | CharItem | RangeWithExcludesItem;

type Alternative = Item[];
type Rule = { name: string; alternatives: Alternative[] };
type Grammar = { rules: Rule[] };


// Build up the parser from smaller parsers.

// space
//     '0020'
const space_ = pc.char(' ');

// indentation
//     space space space space
const indentation_ = p.skip(p.takeN(space_, 4));

// newline
//     '000A'
const newline_ = pc.char('\n');

// letter
//     'a' . 'z'
//     'A' . 'Z'
//     '_'
// (for use in names)
const letter_ = pc.charTest(/[a-zA-Z_]/);

// character
//     ' ' . '10FFFF' - '"'
// (for use in string literals)
const character_ = pc.charTest(/[\u0020-\u{10FFFF}]/u, /[\u0022]/);

// characters
//     character
//     character characters
const characters_ = pc.concat(p.many1(character_));

// hex
//     '0' . '9'
//     'A' . 'F'
const hexDigit_ = pc.charTest(/[0-9A-F]/);

// hexcode
//     "10" hex hex hex hex
//     hex hex hex hex hex
//     hex hex hex hex
const hexCode_ = p.first(
  pc.concat(pc.str('10'), p.takeN(hexDigit_, 4)),
  pc.concat(p.takeN(hexDigit_, 5)),
  pc.concat(p.takeN(hexDigit_, 4)),
);

// Order of alternatives is important for `codepoint` here and others further below,
// because there are possible partial matches.

// codepoint
//     ' ' . '10FFFF'
//     hexcode
const codepoint_ = p.last(
  pc.charTest(/[\u0020-\u{10FFFF}]/u),
  p.map(hexCode_, n => String.fromCodePoint(parseInt(n, 16))),
);


// singleton
//     '\'' codepoint '\''
const singletonItem_: p.Parser<string, unknown, CharItem> = p.map(
  p.middle(pc.char("'"), codepoint_, pc.char("'")),
  c => ({ type: 'char', value: c }),
);

// range
//     singleton space '.' space singleton
const rangeItem_: p.Parser<string, unknown, RangeItem> = p.abc(
  singletonItem_, p.skip(space_, pc.char('.'), space_), singletonItem_,
  (from, _, to) => ({
    type: 'range', from: from.value, to: to.value,
  }),
);

// exclude
//     ""
//     space '-' space singleton exclude
//     space '-' space range exclude
const exclude_ = p.many(p.right(
  p.skip(space_, pc.char('-'), space_),
  p.last<string, unknown, ExcludeItem>( // Gotcha: put common type here
    singletonItem_,
    rangeItem_,
  ),
));

// literal
//     singleton
//     range exclude
//     '"' characters '"'
const literalRangeItem_: p.Parser<string, unknown, RangeWithExcludesItem> = p.ab(
  rangeItem_, exclude_,
  (r, ex) => ({ ...r, excludes: ex }),
);
const literalStringItem_: p.Parser<string, unknown, StringItem> = p.map(
  p.middle(pc.char('"'), characters_, pc.char('"')),
  s => ({ type: 'string', value: s }),
);
const literalItem_ = p.last<string, unknown, Item>(
  singletonItem_,
  literalRangeItem_,
  literalStringItem_,
);

// name
//     letter
//     letter name
const name_ = pc.concat(p.many1(letter_));

const nameItem_: p.Parser<string, unknown, NameItem> = p.map(
  name_,
  n => ({ type: 'name', name: n }),
);

// item
//     literal
//     name
const item_ = p.last(
  literalItem_,
  nameItem_,
);

// items
//     item
//     item space items
const items_ = p.sepBy1(item_, space_);


// nothing
//     ""
//     indentation '"' '"' newline
const nothing_  = p.last(
  p.emit(false),
  p.map(
    p.all(indentation_, pc.char('"'), pc.char('"'), newline_),
    () => true,
  ),
);

// alternative
//     indentation items newline
const alternative_: p.Parser<string, unknown, Alternative> = p.middle(indentation_, items_, newline_);

// alternatives
//     alternative
//     alternative alternatives
const alternatives_ = p.many1(alternative_);


// rule
//     name newline nothing alternatives
const rule_: p.Parser<string, unknown, Rule> = p.abc(
  p.left(name_, newline_), nothing_, alternatives_,
  (name, hasEmpty, alts) => {
    const alternatives: Alternative[] = hasEmpty ? [[], ...alts] : alts;
    return { name, alternatives };
  },
);

// rules
//     rule
//     rule newline rules
const rules_ = p.sepBy1(rule_, newline_);


// grammar
//     rules
const grammar_: p.Parser<string, unknown, Grammar> = p.map(
  rules_,
  rs => ({ rules: rs }),
);


// Complete parser

function parseMcKeeman (src: string): Grammar {
  return pc.parse(grammar_, src.trim() + '\n', {}); // ensure trailing newline
}


// Usage

// Using the grammar of McKeeman Form itself as an example to parse, because why not?
const exampleInput = `
grammar
    rules

space
    '0020'

newline
    '000A'

name
    letter
    letter name

letter
    'a' . 'z'
    'A' . 'Z'
    '_'

indentation
    space space space space

rules
    rule
    rule newline rules

rule
    name newline nothing alternatives

nothing
    ""
    indentation '"' '"' newline

alternatives
    alternative
    alternative alternatives

alternative
    indentation items newline

items
    item
    item space items

item
    literal
    name

literal
    singleton
    range exclude
    '"' characters '"'

singleton
    ''' codepoint '''

codepoint
    ' ' . '10FFFF'
    hexcode

hexcode
    "10" hex hex hex hex
    hex hex hex hex hex
    hex hex hex hex

hex
    '0' . '9'
    'A' . 'F'

range
    singleton space '.' space singleton

exclude
    ""
    space '-' space singleton exclude
    space '-' space range exclude

characters
    character
    character characters

character
    ' ' . '10FFFF' - '"'
`;

console.log(inspect(
  parseMcKeeman(exampleInput),
  { breakLength: 70, depth: 7 },
));


// Output

// {
//   rules: [
//     {
//       name: 'grammar',
//       alternatives: [ [ { type: 'name', name: 'rules' } ] ]
//     },
//     {
//       name: 'space',
//       alternatives: [ [ { type: 'char', value: ' ' } ] ]
//     },
//     {
//       name: 'newline',
//       alternatives: [ [ { type: 'char', value: '\n' } ] ]
//     },
//     {
//       name: 'name',
//       alternatives: [
//         [ { type: 'name', name: 'letter' } ],
//         [
//           { type: 'name', name: 'letter' },
//           { type: 'name', name: 'name' }
//         ]
//       ]
//     },
//     {
//       name: 'letter',
//       alternatives: [
//         [
//           { type: 'range', from: 'a', to: 'z', excludes: [] }
//         ],
//         [
//           { type: 'range', from: 'A', to: 'Z', excludes: [] }
//         ],
//         [ { type: 'char', value: '_' } ]
//       ]
//     },

// ... etc. Abridged here, see full output in the test snapshot.
