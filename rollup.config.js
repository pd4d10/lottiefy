import license from 'rollup-plugin-license'
import { uglify } from 'rollup-plugin-uglify'

const licensePlugin = license({
  banner: `/**
 * https://github.com/pd4d10/lottie-renderer
 * Copyright (c) Rongjian Zhang
 * Released under the MIT License
 */`,
})

export default [
  {
    input: 'lib/index.js',
    plugins: [licensePlugin],
    output: {
      format: 'umd',
      name: 'LottieRenderer',
      file: 'dist/lottie-renderer.js',
    },
  },
  {
    input: 'lib/index.js',
    plugins: [uglify(), licensePlugin],
    output: {
      format: 'umd',
      name: 'LottieRenderer',
      file: 'dist/lottie-renderer.min.js',
    },
  },
]
