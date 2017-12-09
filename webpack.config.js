'use strict';

const ETP = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

let path = require('path');

module.exports = {
  entry: {
    app: './src/js/main.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, './'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'pug-html-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/img'),
        use: {
          loader: 'file-loader',
          options: {
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
          options: {
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
          options: {
            presets: ['env', 'es2015', 'es2015-ie']
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.es6']
  },

  devServer: {
    contentBase: './src',
    open: true,
    port: 8000,
    stats: 'errors-only'
  },
  plugins: [
    new ETP('./css/style.css', {allChunks: true}),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      title: 'Factor',
      cache: true,
      minify: {
        html5: true,
        minifyCSS: true,
        collapseWhitespace: false
      }
    })
    // new StyleLintPlugin()
  ]
};
