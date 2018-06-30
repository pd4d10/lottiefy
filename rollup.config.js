import license from 'rollup-plugin-license'
import { uglify } from 'rollup-plugin-uglify'

const licensePlugin = license({
  banner: `/**
 * Lottie Renderer v${require('./package.json').version}
 * https://github.com/pd4d10/lottie-renderer
 * Copyright (c) Rongjian Zhang
 * Released under the MIT License
 */`,
})

const inputFile = 'lib/index.js'
const outputName = 'LottieRenderer'
const outputFile = 'dist/lottie-renderer'

export default [
  {
    input: inputFile,
    plugins: [licensePlugin],
    output: {
      format: 'umd',
      name: outputName,
      file: outputFile + '.js',
    },
  },
  {
    input: inputFile,
    plugins: [uglify(), licensePlugin],
    output: {
      format: 'umd',
      name: outputName,
      file: outputFile + '.min.js',
    },
  },
]
