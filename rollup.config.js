import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import { dts } from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';

function paths (paths) {
  return function (filePath) {
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    for (const [originalPath, replacementPath] of Object.entries(paths)) {
      if (normalizedFilePath.endsWith(originalPath)) {
        return replacementPath;
      }
    }
    return filePath;
  };
}

function externalBySuffix (id) {
  const n = id.replace(/\\/g, '/');
  return n.endsWith('/core.ts') || n.endsWith('/util/util.ts');
}

export default [
  {
    input: 'src/util/util.ts',
    treeshake: false,
    plugins: [
      typescript({ compilerOptions: { declaration: false, isolatedDeclarations: false } }),
      cleanup({ extensions: ['ts'] }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/util/util.mjs',
      },
      {
        format: 'cjs',
        file: 'lib/util/util.cjs',
      },
    ],
  },
  {
    input: 'src/core.ts',
    external: externalBySuffix,
    treeshake: false,
    plugins: [
      typescript({ compilerOptions: { declaration: false, isolatedDeclarations: false } }),
      cleanup({ extensions: ['ts'] }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/core.mjs',
        paths: paths({ '/util/util.ts': './util/util.mjs' }),
      },
      {
        format: 'cjs',
        file: 'lib/core.cjs',
        paths: paths({ '/util/util.ts': './util/util.cjs' }),
      },
    ],
  },
  {
    input: 'src/char.ts',
    external: externalBySuffix,
    treeshake: false,
    plugins: [
      typescript({ compilerOptions: { declaration: false, isolatedDeclarations: false } }),
      cleanup({ extensions: ['ts'] }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/char.mjs',
        paths: paths({ '/util/util.ts': './util/util.mjs', '/core.ts': './core.mjs' }),
      },
      {
        format: 'cjs',
        file: 'lib/char.cjs',
        paths: paths({ '/util/util.ts': './util/util.cjs', '/core.ts': './core.cjs' }),
      },
    ],
  },
  {
    input: 'src/core.ts',
    plugins: [
      dts(),
      del({ targets: 'lib/core', hook: 'writeBundle', verbose: true }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/core.d.mts',
      },
      {
        format: 'cjs',
        file: 'lib/core.d.cts',
      },
    ],
  },
  {
    input: 'src/char.ts',
    external: externalBySuffix,
    plugins: [
      dts(),
      del({ targets: ['lib/char', 'lib/util/util.d.ts'], hook: 'writeBundle', verbose: true }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/char.d.mts',
        paths: paths({ '/core.ts': './core.mjs' }),
      },
      {
        format: 'cjs',
        file: 'lib/char.d.cts',
        paths: paths({ '/core.ts': './core.cjs' }),
      },
    ],
  },
];
