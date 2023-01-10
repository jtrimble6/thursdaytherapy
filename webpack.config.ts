const path = require('path');
const fs = require('fs')

module.exports = {
  entry: './client/src/index.js',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: 'babel-loader',
        exclude: new RegExp(
            fs
              .readFileSync(path.resolve('./non_ES5_node_modules'), 'utf-8')
              .slice(1, -2)
          )
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'build'),
  },
  

};