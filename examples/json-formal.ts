
// https://www.json.org/json-en.html
// This implementation closely follows the formal grammar of JSON as described on the JSON website.


import { inspect } from 'util';
import * as p from '../src/core.ts';
import * as pc from '../src/char.ts';


// Types

type JsonValue = null | true | false | number | string | JsonValue[] | JsonObject;
type JsonObject = { [name: string]: JsonValue };


// Build up the JSON parser from smaller, simpler parsers

// ws
//     ""
//     '0020' ws
//     '000A' ws
//     '000D' ws
//     '0009' ws
const ws_ = p.many(pc.anyOf([
  '\u0020',
  '\u000A',
  '\u000D',
  '\u0009',
]));

// sign
//     ""
//     '+'
//     '-'
const sign_ = p.option(pc.anyOf([
  '+',
  '-',
]), '');

// onenine
//     '1' . '9'
const one_nine_ = pc.anyOf(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

// digit
//     '0'
//     onenine
const digit_ = p.eitherOr(
  pc.char('0'),
  one_nine_,
);

// digits
//     digit
//     digit digits
const digits_ = p.many1(digit_);

// fraction
//     ""
//     '.' digits
const fraction_ = p.option(
  p.ab(pc.char('.'), digits_, (_, d) => {
    return ({ digits: d });
  }),
  null,
);

// exponent
//     ""
//     'E' sign digits
//     'e' sign digits
const exponent_ = p.option(
  p.abc(pc.anyOf(['e', 'E']), sign_, digits_, (_, s, d) => {
    return ({ sign: s, digits: d });
  }),
  null,
);

// integer
//     digit
//     onenine digits
//     '-' digit
//     '-' onenine digits
const integer_ = p.choice(
  p.map(digit_, d => ({ sign: '' as '' | '+' | '-', digits: [d] })),
  p.ab(one_nine_, digits_, (o, d) => ({ sign: '' as const, digits: [o, ...d] })),
  p.ab(pc.char('-'), digit_, (s, d) => ({ sign: s, digits: [d] })),
  p.abc(pc.char('-'), one_nine_, digits_, (s, o, d) => ({ sign: s, digits: [o, ...d] })),
);

// number
//     integer fraction exponent
const number_ = p.abc(
  integer_, fraction_, exponent_,
  (i, f, e) => {
    return parseFloat(
      i.sign
      + i.digits.join('')
      + (f ? '.' + f.digits.join('') : '')
      + (e ? 'e' + e.sign + e.digits.join('') : ''),
    );
  },
);

// hex
//     digit
//     'A' . 'F'
//     'a' . 'f'
const hex_ = p.choice(
  digit_,
  pc.anyOf(['a', 'b', 'c', 'd', 'e', 'f']),
  pc.anyOf(['A', 'B', 'C', 'D', 'E', 'F']),
);

// escape
//     '"'
//     '\'
//     '/'
//     'b'
//     'f'
//     'n'
//     'r'
//     't'
//     'u' hex hex hex hex
const escape_ = p.choice(
  p.map(pc.char('"'), () => '"'),
  p.map(pc.char('\\'), () => '\\'),
  p.map(pc.char('/'), () => '/'),
  p.map(pc.char('b'), () => '\b'),
  p.map(pc.char('f'), () => '\f'),
  p.map(pc.char('n'), () => '\n'),
  p.map(pc.char('r'), () => '\r'),
  p.map(pc.char('t'), () => '\t'),
  p.ab(
    pc.char('u'), p.takeN(hex_, 4),
    (_, h) => {
      return String.fromCharCode(parseInt(h.join(''), 16));
    },
  ),
);

// character
//     '0020' . '10FFFF' - '"' - '\'
//     '\' escape
const character_ = p.eitherOr(
  // double quote is U+0022, backslash is U+005C
  pc.charTest(/[\u0020-\u{10FFFF}]/u, /[\u0022\u005C]/),
  p.ab(pc.char('\\'), escape_, (_, e) => e),
);

// characters
//     ""
//     character characters
const characters_ = p.many(character_);

// string
//     '"' characters '"'
const string_ = p.map(
  p.middle(pc.char('"'), characters_, pc.char('"')),
  cs => cs.join(''),
);

// element
//     ws value ws
const element_ = p.middle(ws_, p.recursive(() => value_), ws_);

// elements
//     element
//     element ',' elements
const elements_ = p.sepBy1(element_, pc.char(','));

// array
//     '[' ws ']'
//     '[' elements ']'
const array_ = p.eitherOr(
  p.abc(
    pc.char('['), ws_, pc.char(']'),
    () => [],
  ),
  p.middle(pc.char('['), elements_, pc.char(']')),
);

// member
//     ws string ws ':' element
const member_ = p.ab(
  p.middle(ws_, string_, ws_), p.right(pc.char(':'), element_),
  (name, value) => ({ name, value }),
);

// members
//     member
//     member ',' members
const members_ = p.sepBy1(member_, pc.char(','));

// object
//     '{' ws '}'
//     '{' members '}'
const object_ = p.eitherOr(
  p.abc(
    pc.char('{'), ws_, pc.char('}'),
    () => ({}),
  ),
  p.abc(
    pc.char('{'), members_, pc.char('}'),
    (_, b) => {
      const obj: JsonObject = {};
      for (const m of b) {
        obj[m.name] = m.value;
      }
      return obj;
    },
  ),
);

// value
//     object
//     array
//     string
//     number
//     "true"
//     "false"
//     "null"
const value_: p.Parser<string, unknown, JsonValue> = p.choice(
  object_,
  array_,
  string_,
  number_,
  p.map(pc.str('true'), () => true),
  p.map(pc.str('false'), () => false),
  p.map(pc.str('null'), () => null),
);

// json
//     element
const json_ = element_;

// Complete parser

function parseJson (json: string): JsonValue {
  return pc.parse(json_, json, {});
}


// Usage

console.log(inspect(parseJson('"Hello World!"')));
console.log(inspect(parseJson(`
{
  "foo": true, "bar": "baz",
  "qux": [1, 2, [3], [ ], { "quux": "quuz" }]
}
`), { breakLength: 50 }));


// Output

// 'Hello World!'
// {
//   foo: true,
//   bar: 'baz',
//   qux: [ 1, 2, [ 3 ], [], { quux: 'quuz' } ]
// }
