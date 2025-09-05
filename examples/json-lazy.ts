
// https://www.json.org/json-en.html
// This implementation deviates from the formal grammar of JSON to do some work in the lexing phase.
// The way strings are handled can be considered "cheating".
// Look at the `examples/json-formal.ts` for a more rigorous implementation.
// Alternatively, strings would require another small parser to handle escape sequences, which doesn't meet the goal of keeping this example short.


import { createLexer, type Token } from 'leac';
import { inspect } from 'util';
import * as p from '../src/core.ts';


// Types

type JsonValue = null | true | false | number | string | JsonValue[] | JsonObject;
type JsonObject = { [name: string]: JsonValue };

type ObjectMember = { name: string; value: JsonValue };


// Lexer / tokenizer

const lex = createLexer([
  { name: '{' },
  { name: '}' },
  { name: '[' },
  { name: ']' },
  { name: ',' },
  { name: ':' },
  { name: 'null' },
  { name: 'true' },
  { name: 'false' },
  {
    name: 'space',
    regex: /\s+/,
    discard: true,
  },
  { name: 'number', regex: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/ },
  { name: 'string', regex: /"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/ },
]);


// Build up the JSON parser from smaller, simpler parsers

function literal (name: string): p.Parser<Token, unknown, true> {
  return p.token(t => t.name === name ? true : undefined);
}

const null_: p.Parser<Token, unknown, null>
  = p.token(t => t.name === 'null' ? null : undefined);

const true_: p.Parser<Token, unknown, true>
  = p.token(t => t.name === 'true' ? true : undefined);

const false_: p.Parser<Token, unknown, false>
  = p.token(t => t.name === 'false' ? false : undefined);

const number_: p.Parser<Token, unknown, number>
  = p.token(t => t.name === 'number' ? parseFloat(t.text) : undefined);

const string_: p.Parser<Token, unknown, string>
  = p.token(t => t.name === 'string' ? JSON.parse(t.text) as string : undefined);

const array_ = p.middle(
  literal('['),
  p.sepBy(
    p.recursive(() => value_),
    literal(','),
  ),
  literal(']'),
);

const member_: p.Parser<Token, unknown, ObjectMember> = p.ab(
  string_,
  p.right(
    literal(':'),
    p.recursive(() => value_),
  ),
  (name, value) => ({ name: name, value: value }),
);

const object_ = p.middle(
  literal('{'),
  p.map(
    p.sepBy(
      member_,
      literal(','),
    ),
    pairs => pairs.reduce(
      (acc, pair) => { acc[pair.name] = pair.value; return acc; },
      {} as JsonObject,
    ),
  ),
  literal('}'),
);

const value_: p.Parser<Token, unknown, JsonValue> = p.choice<Token, unknown, JsonValue>(
  null_,
  true_,
  false_,
  number_,
  string_,
  array_,
  object_,
);


// Complete parser

function parseJson (json: string): JsonValue {
  const lexerResult = lex(json);
  if (!lexerResult.complete) {
    console.warn(
      `Input string was only partially tokenized, stopped at offset ${lexerResult.offset}!`,
    );
  }
  return p.parse(value_, lexerResult.tokens, {});
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
