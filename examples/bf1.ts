
// This implementation "compiles" a Brainfuck code into a runnable function.

import * as p from '../src/core';
import * as pc from '../src/char';


// Types

type Options = {
  maxLoops: number // max number of loops before terminating the computation
}

type State = {
  pointer: number,   // points at a memory cell
  memory:  number[], // memory tape
  input:   number[], // input buffer for the read op
  output:  number[], // output buffer for the write op
};

type Op = (state: State) => void; // A function that modifies state in-place.


// Build up the parser / compiler

function getValue (state: State) {
  return state.memory[state.pointer] || 0;
}

function setValue (state: State, value: number) {
  state.memory[state.pointer] = value % 256;
}

function makeOpParser (char: string, op: Op): p.Parser<string,Options,Op> {
  return p.right(
    pc.char(char),
    p.emit(op)
  );
}

function makeSequence (ops: Op[]): Op {
  return (state: State) => {
    for (const op of ops) {
      op(state);
    }
  };
}

const next = makeOpParser('>', (st) => { st.pointer++; });
const prev = makeOpParser('<', (st) => { st.pointer--; });

const inc = makeOpParser('+', (st) => { setValue(st, getValue(st) + 1); });
const dec = makeOpParser('-', (st) => { setValue(st, getValue(st) - 1); });

const write = makeOpParser('.', (st) => { st.output.push(getValue(st)); });
const read  = makeOpParser(',', (st) => { setValue(st, st.input.shift() || 0); });

const parseAnyOp = p.choice(
  next, prev,
  inc, dec,
  write, read,
  p.recursive(() => loop)
);

const loop: p.Parser<string,Options,Op> = p.middle(
  pc.char('['),
  p.chain(
    p.many( parseAnyOp ),
    (ops, data) => {
      const seq = makeSequence(ops);
      const maxLoops = data.options.maxLoops;
      return p.emit(
        (state: State) => {
          let loopCounter = maxLoops;
          while (getValue(state)) {
            if (--loopCounter < 0) {
              throw new Error('Loop counter exhausted!');
            }
            seq(state);
          }
        }
      );
    }
  ),
  p.token(
    (c) => (c === ']') ? c : undefined,
    () => { throw new Error('Missing closing bracket!'); }
  )
);

const unexpectedBracket = p.right(
  pc.char(']'),
  p.error('Unexpected closing bracket!')
);

const parseAll = p.map(
  p.many(p.choice(
    parseAnyOp,
    unexpectedBracket
  )),
  makeSequence
);


// Wrap it up

function compile (program: string, maxLoops = 1_000) {
  const op = pc.match(
    parseAll,
    program.replace(/[^-+<>.,[\]]/g, ''),
    { maxLoops: maxLoops }
  );
  return (input: string) => {
    const state: State = {
      pointer: 0,
      memory: [],
      input: [...input].map(c => c.charCodeAt(0)),
      output: []
    };
    op(state);
    return state.output
      .map(c => String.fromCharCode(c))
      .join('');
  };
}


// Usage

const cat = compile(',[.,]'); // Copy input to output and stop.

const helloWorld = compile(`
[ This program prints "Hello World!" and a newline to the screen.

  This loop is an "initial comment loop", a simple way of adding a comment
  to a BF program such that you don't have to worry about any command
  characters. Any ".", ",", "+", "-", "<" and ">" characters are simply
  ignored, the "[" and "]" characters just have to be balanced. This
  loop and the commands it contains are ignored because the current cell
  defaults to a value of 0; the 0 value causes this loop to be skipped.
]
+++++ +++++             initialize counter (cell #0) to 10
[                       use loop to set the next four cells to 70/100/30/10
    > +++++ ++              add  7 to cell #1
    > +++++ +++++           add 10 to cell #2 
    > +++                   add  3 to cell #3
    > +                     add  1 to cell #4
    <<<< -                  decrement counter (cell #0)
]
> ++ .                  print 'H' ( 72)
> + .                   print 'e' (101)
+++++ ++ .              print 'l' (108)
.                       print 'l' (108)
+++ .                   print 'o' (111)
> ++ .                  print ' ' ( 32)
<< +++++ +++++ +++++ .  print 'W' ( 87)
> .                     print 'o' (111)
+++ .                   print 'r' (114)
----- - .               print 'l' (108)
----- --- .             print 'd' (100)
> + .                   print '!' ( 33)
> .                     print '\n'( 10)
`);

console.log(cat('Meow!'));
console.log(helloWorld(''));


// Output

// Meow!
// Hello World!
//
