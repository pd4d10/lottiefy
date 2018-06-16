const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'production',
  watch: false,
  devtool: false,
})
