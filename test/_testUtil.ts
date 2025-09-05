import type { ExecutionContext } from 'ava';
import type { Parser } from '../src/coreTypes/Parser.ts';
import type { Result } from '../src/coreTypes/Result.ts';

import { token } from '../src/core/token.ts';

export const data123 = { tokens: [11, 22, 33] as number[], options: {} };

export const dataHello = { tokens: [...'hello'], options: {} };

export const dataLorem = { tokens: ['Ĺ', 'o͂', 'ř', 'ȩ', 'm̅', '🏳️‍🌈'], options: {} };


export function numbers123Macro<TResult> (
  t: ExecutionContext,
  p: Parser<number, unknown, TResult>,
  i: number,
  expected: Result<TResult>,
): void {
  t.deepEqual(p(data123, i), expected);
}

export function helloMacro (
  t: ExecutionContext,
  p: Parser<string, unknown, unknown>,
  i: number,
  expected: Result<unknown>,
) {
  t.deepEqual(p(dataHello, i), expected);
}

export function loremMacro (
  t: ExecutionContext,
  p: Parser<string, unknown, unknown>,
  i: number,
  expected: Result<unknown>,
) {
  t.deepEqual(p(dataLorem, i), expected);
}


export const tokenNegative = token(
  (t: number) => (t < 0)
    ? t
    : undefined,
);

export const tokenOdd = token(
  (t: number) => (t % 2 === 0)
    ? undefined
    : t,
);

export const tokenEven = token(
  (t: number) => (t % 2 === 0)
    ? t
    : undefined,
);

export const tokenEvenR = token(
  (t: number, data, i) => (t % 2 === 0)
    ? {
        value: t,
        data: data,
        i: i,
      }
    : undefined,
);

export const tokenAlterEvenness = token(
  (t: number) => (t % 2 === 0)
    ? tokenOdd
    : tokenEven,
);

export const tokenSameEvenness = token(
  (t: number) => (t % 2 === 0)
    ? tokenEven
    : tokenOdd,
);

export const tokenAddX = token(
  (t: number) => (x: number) => x + t,
);

export const tokenBinaryOp = token(
  (t: number) => (x: number, y: number) => x * t + y,
);
