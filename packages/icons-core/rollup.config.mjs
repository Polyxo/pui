import dts from 'rollup-plugin-dts';
const config = [
  {
    input: 'build/compiled/index.js',
    output: {
      file: 'build/bundle.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['axios', 'os', 'url'],
  },
  {
    input: 'build/compiled/index.d.ts',
    plugins: [dts()],
    output: {
      file: `dist/bundle.d.ts`,
      format: 'es',
    },
  },
];
export default config;
