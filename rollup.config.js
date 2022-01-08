import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';

export default [
  {
    external: [],
    input: 'src/char.ts',
    treeshake: false,
    plugins: [
      typescript(),
      cleanup({ extensions: ['ts'] })
    ],
    output: [
      {
        dir: 'lib',
        format: 'es',
        preserveModules: true,
        entryFileNames: '[name].mjs',
      },
      {
        dir: 'lib',
        format: 'cjs',
        preserveModules: true,
        entryFileNames: '[name].cjs',
      },
    ],
  },
];
