const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./flare_client/index.html",
  filename: "./index.html"
});

module.exports = {
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/build',
    publicPath: '/client/'
  },
  entry: './flare_client/index.js',
  mode: 'development',
  watch: true,
  devServer: {
    port: 3000
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }]
  },
  plugins: [htmlPlugin]
};