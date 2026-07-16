/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  entry: '/src/index.js', // main js
  output: {
    path: path.resolve(__dirname, 'dist'), // output folder
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env.local',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // base html
    }),
  ],
}
