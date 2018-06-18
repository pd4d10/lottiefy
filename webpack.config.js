const path = require('path')

module.exports = {
  watch: true,
  devtool: 'inline-source-map',
  output: {
    path: path.resolve('./dist'),
    filename: 'lottie-renderer.js',
    library: 'lottieRenderer',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: 'development',
}
