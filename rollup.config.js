import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const input = 'lib/rough-notation.js';

export default [
  {
    input,
    output: {
      file: 'lib/rough-notation.iife.js',
      format: 'iife',
      name: 'RoughNotation'
    },
    plugins: [resolve(), terser()]
  },
  {
    input,
    output: {
      file: 'lib/rough-notation.esm.js',
      format: 'esm'
    },
    plugins: [resolve(), terser()]
  },
  {
    input,
    output: {
      file: 'lib/rough-notation.cjs.js',
      format: 'cjs'
    },
    plugins: [resolve(), terser()]
  },
];