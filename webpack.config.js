const path = require('path')

module.exports = {
  watch: true,
  devtool: 'inline-source-map',
  output: {
    path: path.resolve('./dist'),
    filename: 'lottie-cocos2dx.js',
    library: 'lottie',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts'],
  },
  mode: 'development',
}
