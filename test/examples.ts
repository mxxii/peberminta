import test, {ExecutionContext} from 'ava';

import { execFileSync } from 'child_process';

function snapshotMacro(t: ExecutionContext, examplePath: string) {
  const stdout = execFileSync('node', [
    '--experimental-specifier-resolution=node',
    '--loader',
    'ts-node/esm',
    examplePath
  ]);
  t.snapshot(stdout.toString(), examplePath);
}

test('brainfuck-1', snapshotMacro, './examples/bf1.ts');

test('brainfuck-2', snapshotMacro, './examples/bf2.ts');

test('calc', snapshotMacro, './examples/calc.ts');

test('csv', snapshotMacro, './examples/csv.ts');

test('hexColor', snapshotMacro, './examples/hexColor.ts');

test('json', snapshotMacro, './examples/json.ts');

test('nonDec', snapshotMacro, './examples/nonDec.ts');
