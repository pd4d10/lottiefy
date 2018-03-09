import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: './src/index.ts',
    plugins: [
      typescript({
        cacheRoot: '/tmp/rollup-ts-cache',
      }),
    ],
    output: {
      file: 'dist/lottie-cocos.js',
      format: 'iife',
      name: 'lottie',
    },
  },
]
