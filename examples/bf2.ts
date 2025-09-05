
// This implementation abuses the openness of the parser convention
// by "parsing" in non-linear fashion.
// Parser position is being manipulated by the parsed code,
// making it to behave exactly like an instruction pointer of an interpreting machine.


import * as p from '../src/core.ts';
import * as pc from '../src/char.ts';


// Types

type State = {
  pointer: number;   // points at a memory cell
  memory:  number[]; // memory tape
  input:   number[]; // input buffer for the read op
  output:  number[]; // output buffer for the write op
  jumps:   number;    // max number of jumps before terminating the computation
};

type OpToken = '<' | '>' | '+' | '-' | '.' | ',';
type Token = OpToken | number;


// First round parser - replace brackets with indices
// It does a bit more that a lexer/tokenizer, or is it?
// Let's call it translator since it translates the input Brainfuck program
// into a new language that is almost the same except there are
// jump offsets in place of brackets.

const translate = p.flatten1(
  p.many(
    p.eitherOr(
      pc.oneOf('<>+-.,') as p.Parser<string, unknown, Token>,
      p.recursive(() => brackets) as p.Parser<string, unknown, Token | Token[]>,
    ),
  ),
);

const brackets: p.Parser<string, unknown, Token[]> = p.abc(
  pc.char('['),
  translate,
  p.token(
    c => (c === ']') ? c : undefined,
    () => { throw new Error('Missing closing bracket!'); },
  ),
  (_, ops) => [ops.length + 1, ...ops, -ops.length - 1],
);


// Second round parser - interpreter

function op (
  op: OpToken,
  f: (state: State) => void,
): p.Parser<Token, State, true> {
  return p.middle(
    p.satisfy(t => t === op),
    p.emit(true),
    p.action((data) => { f(data.options); }),
  );
}

function getValue (state: State) {
  return state.memory[state.pointer] || 0;
}

function setValue (state: State, value: number) {
  state.memory[state.pointer] = value % 256;
}

const next = op('>', (state) => { state.pointer++; });
const prev = op('<', (state) => { state.pointer--; });

const inc = op('+', (state) => { setValue(state, getValue(state) + 1); });
const dec = op('-', (state) => { setValue(state, getValue(state) - 1); });

const write = op('.', (state) => { state.output.push(getValue(state)); });
const read  = op(',', (state) => { setValue(state, state.input.shift() || 0); });

function goto (position: number): p.Match<true> {
  return {
    matched: true,
    position: position,
    value: true,
  };
}

const jump: p.Parser<Token, State, true> = (data, i) => {
  if (--data.options.jumps < 0) {
    throw new Error('Jumps counter exhausted!');
  }
  const t = data.tokens[i];
  if (typeof t !== 'number') { return { matched: false }; }
  const v = getValue(data.options);
  const isForward = (t > 0);
  const isLoop = (v !== 0);
  return (isForward === isLoop)
    ? goto(i + 1)      // no jump
    : goto(i + 1 + t); // jump after the matching bracket
};

const anyOp = p.choice(
  next, prev,
  inc, dec,
  write, read,
  jump,
);

const interpret = p.many(anyOp);


// Complete interpreter

function run (
  bfProgram: string,
  input: string,
  jumps = 10_000,
): string {
  const translatedProgram = pc.match(translate, bfProgram.replace(/[^-+<>.,[\]]/g, ''), {});
  const state: State = {
    pointer: 0,
    memory:  [],
    input:   [...input].map(c => c.charCodeAt(0)),
    output:  [],
    jumps:   jumps,
  };
  p.match(interpret, translatedProgram, state);
  return state.output
    .map(c => String.fromCharCode(c))
    .join('');
}


// Usage

const cat = ',[.,]'; // Copy input to output and stop.

const xmastree = `
[xmastree.b -- print Christmas tree
(c) 2016 Daniel B. Cristofani
http://brainfuck.org/]

>>>--------<,[<[>++++++++++<-]>>[<------>>-<+],]++>>++<--[<++[+>]>+<<+++<]<
<[>>+[[>>+<<-]<<]>>>>[[<<+>.>-]>>]<.<<<+<<-]>>[<.>--]>.>>.
`;

console.log(run(cat, 'Meow!'));
console.log(run(xmastree, '11'));


// Output

// Meow!
//            *
//           ***
//          *****
//         *******
//        *********
//       ***********
//      *************
//     ***************
//    *****************
//   *******************
//  *********************
//            *
