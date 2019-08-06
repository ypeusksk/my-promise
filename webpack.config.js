const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const plugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    hash: true
  })
]

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins,
  devtool: 'source-map'
}

