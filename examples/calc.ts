
// Calculator that supports metric and binary unit prefixes.
// (No actual units - that'd be quite a bit more work.)

// https://en.wikipedia.org/wiki/Unit_prefix
// https://en.wikipedia.org/wiki/Metric_prefix

// Good calculator might need a BigNumber support.
// This is just an example and such detail is irrelevant from the parsing side.

// On the other hand, challenging grammar is relevant to the exaple.
// In addition to unit prefixes this calculator also supports:
// - math constants;
// - functions of 1 or 2 arguments;
// - exponent after a function name as in written math expressions;
// - right associative exponent and unary minus at the same level of precedence;
// - factorial.

// Precedence levels and associativity:
// 1. atom_               parentheses
// 2. factorial_          [!]
// 3. signExp_    right   [-^]
// 4. prod_       left    [*/%]
// 5. sum_        left    [+-]

import { createLexer, Token } from 'leac';
import * as p from '../src/core';


const multipliers: Record<string, number> = {
  y: 10 ** -24,
  z: 10 ** -21,
  a: 10 ** -18,
  f: 10 ** -15,
  p: 10 ** -12,
  n: 10 ** -9,
  u: 10 ** -6,
  m: 10 ** -3,
  c: 10 ** -2,
  d: 10 ** -1,
  da: 10,
  h: 100,
  k: 10 ** 3,
  M: 10 ** 6,
  G: 10 ** 9,
  T: 10 ** 12,
  P: 10 ** 15,
  E: 10 ** 18,
  Z: 10 ** 21,
  Y: 10 ** 24,
  ki: 2 ** 10,
  Mi: 2 ** 20,
  Gi: 2 ** 30,
  Ti: 2 ** 40,
  Pi: 2 ** 50,
  Ei: 2 ** 60,
  Zi: 2 ** 70,
  Yi: 2 ** 80
};


// Lexer / tokenizer

const lex = createLexer([
  { name: '(', str: '(' },
  { name: ')', str: ')' },
  { name: ',', str: ',' },
  { name: '^', str: '^' },
  { name: '!', str: '!' },
  { name: '-', str: '-' },
  { name: '+', str: '+' },
  { name: '*', str: '*' },
  { name: '/', str: '/' },
  { name: '%', str: '%' },
  {
    name: 'space',
    regex: /\s+/,
    discard: true
  },
  { name: 'number', regex: /(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?(?![0-9])/ },
  { name: 'unitPrefix', regex: /(?:[yzafpnumcdh]|da|[kMGTPEZY]i?)\b/ },
  { name: 'unaryFun', regex: /a?sin|a?cos|a?tan|ln|lg\b/ },
  { name: 'biFun', regex: /log\b/ },
  { name: 'constant', regex: /e|pi|tau\b/ },
]);


// Build up the calculator from smaller, simpler parts

function literal (type: string): p.Parser<Token,unknown,true> {
  return p.token((t) => t.name === type ? true : undefined);
}

const number_: p.Parser<Token,unknown,number>
= p.token((t) => t.name === 'number' ? parseFloat(t.text) : undefined);

const unitPrefix_: p.Parser<Token,unknown,number>
= p.token((t) => t.name === 'unitPrefix' ? multipliers[t.text] : undefined );

const scaledNumber_: p.Parser<Token,unknown,number> = p.ab(
  number_,
  p.option(unitPrefix_, 1),
  (value, multiplier) => value * multiplier
);

const constant_: p.Parser<Token,unknown,number> = p.token((t) => {
  if (t.name !== 'constant') { return undefined; }
  switch (t.text) {
    case 'e':
      return Math.E;
    case 'pi':
      return Math.PI;
    case 'tau':
      return Math.PI * 2;
    default:
      throw new Error(`Unexpected constant name: "${t.text}"`);
  }
});

const unaryFun_: p.Parser<Token,unknown,(x: number) => number> = p.ab(
  p.token((t) => {
    if (t.name !== 'unaryFun') { return undefined; }
    switch (t.text) {
      case 'sin':
        return (x) => Math.sin(x);
      case 'cos':
        return (x) => Math.cos(x);
      case 'tan':
        return (x) => Math.tan(x);
      case 'asin':
        return (x) => Math.asin(x);
      case 'acos':
        return (x) => Math.acos(x);
      case 'atan':
        return (x) => Math.atan(x);
      case 'ln':
        return (x) => Math.log(x);
      case 'lg':
        return (x) => Math.log10(x);
      default:
        throw new Error(`Unexpected function name: "${t.text}"`);
    }
  }) as p.Parser<Token,unknown,(x: number) => number>,
  p.option(p.right(
    literal('^'),
    p.recursive(() => signExp_)
  ), 1),
  (f, pow: number) => (pow === 1) ? f : (x) => f(x) ** pow
);

const biFun_: p.Parser<Token,unknown,(x: number, y: number) => number> = p.ab(
  p.token((t) => {
    if (t.name !== 'biFun') { return undefined; }
    switch (t.text) {
      case 'log':
        return (x, y) => Math.log(x) / Math.log(y);
      default:
        throw new Error(`Unexpected function name: "${t.text}"`);
    }
  }) as p.Parser<Token,unknown,(x: number, y: number) => number>,
  p.option(p.right(
    literal('^'),
    p.recursive(() => signExp_)
  ), 1),
  (f, pow: number) => (pow === 1) ? f : (x, y) => f(x, y) ** pow
);

const expression_: p.Parser<Token,unknown,number> = p.recursive(
  () => sum_
);

const paren_ = p.middle(
  literal('('),
  expression_,
  literal(')')
);

const unaryFunWithParen_ = p.ab(
  unaryFun_,
  paren_,
  (f, x) => f(x)
);

const biFunWithParen_ = p.abc(
  biFun_,
  p.middle(
    literal('('),
    expression_,
    literal(',')
  ),
  p.left(
    expression_,
    literal(')')
  ),
  (f, x, y) => f(x, y)
);

const atom_ = p.choice(
  paren_,
  unaryFunWithParen_,
  biFunWithParen_,
  scaledNumber_,
  constant_
);

const factorialCache = [1, 1];
function factorial (n: number)
{
  if (n < 0) {
    throw new Error(`Trying to take factorial of ${n}, a negavive value!`);
  }
  if (!Number.isSafeInteger(n)) {
    throw new Error(`Trying to take factorial of ${n}, not a safe integer!`);
  }
  if (typeof factorialCache[n] != 'undefined') { return factorialCache[n]; }
  let i = factorialCache.length;
  let result = factorialCache[i-1];
  for (; i <= n; i++) {
    factorialCache[i] = result = result * i;
  }
  return result;
}

const factorial_: p.Parser<Token,unknown,number> = p.leftAssoc1(
  atom_,
  p.map(
    literal('!'),
    () => (x) => factorial(x)
  )
);

const signExp_ = p.rightAssoc1(
  p.choice(
    p.map(
      literal('-'),
      () => (y) => -y
    ),
    p.ab(
      factorial_,
      literal('^'),
      (x) => (y) => x ** y
    )
  ),
  factorial_
);

const prod_ = p.leftAssoc2(
  signExp_,
  p.token((t) => {
    switch (t.name) {
      case '*':
        return (x, y) => x * y;
      case '/':
        return (x, y) => x / y;
      case '%':
        return (x, y) => x % y;
      default:
        return undefined;
    }
  }),
  signExp_
);

const sum_ = p.leftAssoc2(
  prod_,
  p.token((t) => {
    switch (t.name) {
      case '+':
        return (x, y) => x + y;
      case '-':
        return (x, y) => x - y;
      default:
        return undefined;
    }
  }),
  prod_
);


// Complete calculator

function calc(expr: string): number {
  const lexerResult = lex(expr);
  if (!lexerResult.complete) {
    console.warn(
      `Input string was only partially tokenized, stopped at offset ${lexerResult.offset}!`
    );
  }
  return p.parse(expression_, lexerResult.tokens, undefined);
}


// Usage and output

console.log(calc('2m + 2k'));                 // 2000.002
console.log(calc('1ki/2*0.5/2/2'));           // 64
console.log(calc('1ki * 1e-3'));              // 1.024
console.log(calc('--3!!'));                   // 720
console.log(calc('log(2 Mi, 2)'));            // 21
console.log(calc('ln(e^-2^2)'));              // -3.9999999999999996
console.log(calc('2*-asin(cos(pi))'));        // 3.141592653589793
console.log(calc('cos^2(42) + sin(42)^2'));   // 1
console.log(calc('cos^2(pi/3)^0.5'));         // 0.5000000000000001
console.log(calc('(pi/2 + tau/2) / (e+2)'));  // 0.9987510606003204
