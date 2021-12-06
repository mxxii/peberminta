import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    external: [],
    input: 'src/core.ts',
    plugins: [typescript(), terser()],
    output: [
      { file: pkg.exports['.'].import, format: 'es', sourcemap: true },
      { file: pkg.exports['.'].require, format: 'cjs', sourcemap: true },
    ],
  },
  {
    external: ['./core'],
    input: 'src/char.ts',
    plugins: [typescript(), terser()],
    output: [
      { file: pkg.exports['./char'].import, format: 'es', sourcemap: true },
      { file: pkg.exports['./char'].require, format: 'cjs', sourcemap: true },
    ],
  },
];
