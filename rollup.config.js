export default [
  {
    input: './src/index.ts',
    plugins: [
      require('rollup-plugin-typescript2')({
        cacheRoot: '/tmp/rollup-ts-cache',
        // typescript: require('typescript'),
      }),
      // require('rollup-plugin-node-resolve')({}),
      // require('rollup-plugin-commonjs')(),
    ],
    output: {
      file: 'dist/lottie-cocos.js',
      format: 'iife',
      name: 'lottie',
    },
  },
]
