import license from 'rollup-plugin-license'
import { uglify } from 'rollup-plugin-uglify'

const licensePlugin = license({
  banner: `/**
 * Lottie Renderer v${require('./package.json').version}
 * https://github.com/pd4d10/lottie-cocos2dx-lua
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
      name: 'lottieCocos2dxLua',
      file: 'dist/lottie-cocos2dx-lua.js',
    },
  },
  {
    input: 'lib/index.js',
    plugins: [uglify(), licensePlugin],
    output: {
      format: 'umd',
      name: 'lottieCocos2dxLua',
      file: 'dist/lottie-cocos2dx-lua.min.js',
    },
  },
]
