import babel from 'rollup-plugin-babel'
import license from 'rollup-plugin-license'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

const licensePlugin = license({
  banner: `/**
 * lottie-cocos2dx v${require('./package.json').version}
 * https://github.com/pd4d10/lottie-cocos2dx
 * Copyright (c) Rongjian Zhang
 * Released under the MIT License
 */`,
})

const commonPlugins = [
  nodeResolve(),
  commonjs(),
  babel({ exclude: 'node_modules/**' }),
]

const inputFile = 'src/index.js'
const outputName = 'lottie'
const outputFile = 'dist/lottie-cocos2dx'

export default [
  {
    input: inputFile,
    plugins: commonPlugins,
    output: {
      file: outputFile + '.common.js',
      format: 'cjs',
    },
  },
  {
    input: inputFile,
    plugins: [...commonPlugins, licensePlugin],
    output: {
      name: outputName,
      file: outputFile + '.js',
      format: 'umd',
    },
  },
  {
    input: inputFile,
    plugins: [...commonPlugins, uglify(), licensePlugin],
    output: {
      name: outputName,
      file: outputFile + '.min.js',
      format: 'umd',
    },
  },
]
