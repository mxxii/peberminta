import type { ExecutionContext } from 'ava';
import test from 'ava';

import { execFileSync } from 'child_process';

export default { require: ['./_force-exit.ts'] };

function snapshotMacro (t: ExecutionContext, examplePath: string) {
  const stdout = execFileSync('node', [
    '--import=ts-blank-space/register',
    examplePath,
  ]);
  t.snapshot(stdout.toString(), examplePath);
}

test('brainfuck-1', snapshotMacro, './examples/bf1.ts');

test('brainfuck-2', snapshotMacro, './examples/bf2.ts');

test('calc', snapshotMacro, './examples/calc.ts');

test('csv', snapshotMacro, './examples/csv.ts');

test('hexColor', snapshotMacro, './examples/hexColor.ts');

test('json-lazy', snapshotMacro, './examples/json-lazy.ts');

test('json-formal', snapshotMacro, './examples/json-formal.ts');

test('nonDec', snapshotMacro, './examples/nonDec.ts');

test('mckeeman-form', snapshotMacro, './examples/mckeeman-form.ts');
