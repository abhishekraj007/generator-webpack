'use strict';

let ETP = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let copyWebpackPlugin = require('copy-webpack-plugin');
let webpack = require('webpack');
let path = require('path');

module.exports = {
  entry: [
    './src/js/main.js'
  ],
  output: {
    filename: './js/bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  eslint: {
    configFile: './.eslintrc'
  },
  resolveUrlLoader: {
    keepQuery: true,
    sourceMap: true
  },
  module: {
    loaders: [
      {
        test: /\.pug$/,
        include: path.join(__dirname, 'src'),
        loaders: ['raw-loader', 'pug-html-loader']
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html'
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/img'),
        loader: "file-loader",
        query: {
          name: 'img/[name].[ext]',
          publicPath: '../'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: path.join(__dirname, 'src/img'),
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[ext]',
          publicPath: '../'
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ETP.extract('style-loader', 'css-loader!resolve-url-loader!postcss-loader!sass-loader?sourceMap')
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: true}),
    new ETP('./css/style.css',{allChunks: true}),
    new copyWebpackPlugin([
           { 
             from: './src/img',
             to: './img'
           }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      inject: true,
      minify: {
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        decodeEntities: true,
        collapseWhitespace: false,
        useShortDoctype: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/about.pug',
      filename: 'about.html',
      inject: true,
      minify: {
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        decodeEntities: true,
        collapseWhitespace: false,
        useShortDoctype: true
      }
    })
  ]
};
