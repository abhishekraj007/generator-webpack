'use strict'

const ETP = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    main: './src/js/main.js'
  },
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: path.join(__dirname, 'src'),
        use: ['raw-loader', 'pug-html-loader']
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader'
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          query: {
            name: 'img/[name].[ext]',
            publicPath: '../'
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          query: {
            name: 'fonts/[name].[ext]',
            publicPath: '../'
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ETP.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
              // options: {
              //   sourceMap: true,
              //   importLoaders: 3
              // }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['env', 'es2015', 'es2015-ie']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.es6']
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.LoaderOptionsPlugin({
      // Options...
      options: {
        resolveUrlLoader: {
          keepQuery: true,
          sourceMap: true
        }
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        mangle: false,
        sourceMap: true,
        exclude: /\/node_modules/
      }
    }),
    new ETP('./css/style.css', {allChunks: true}),
    new CopyWebpackPlugin([
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
    })
  ]
}
