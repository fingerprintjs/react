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
      // Fall back to process.env (e.g. CI-provided vars) and stay quiet when
      // the local file is absent, so the example builds without a .env.local.
      systemvars: true,
      silent: true,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // base html
    }),
  ],
}
